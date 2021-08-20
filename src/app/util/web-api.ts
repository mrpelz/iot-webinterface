import { connectWorker, webApiUrl } from './workers.js';

type SetupMessage = { apiBaseUrl: string; lowPriorityStream: boolean };

enum ChildChannelType {
  GETTER,
  SETTER,
}

type ChildChannelRequest = [ChildChannelType, number];

type GetterCallback<T> = (value: T) => void;

type Getter = {
  remove: () => void;
};

type Setter<T> = {
  remove: () => void;
  set: (value: T) => void;
};

const CLOSE_CHILD = '880E1EE9-15A2-462D-BCBC-E09630A1CFBB';

export class WebApi {
  private readonly _port: MessagePort | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly hierarchy: Promise<any>;

  constructor(apiBaseUrl: string, lowPriorityStream: boolean) {
    this._port = connectWorker<SetupMessage>(webApiUrl, 'web-api', {
      apiBaseUrl,
      lowPriorityStream,
    });

    this.hierarchy = new Promise((resolve) => {
      if (!this._port) return;

      this._port.onmessage = ({ data }) => {
        resolve(data);
      };
    });

    (async () => {
      // eslint-disable-next-line no-console
      console.info('web-api:', await this.hierarchy);
    })();
  }

  createGetter<T>(index: number, callback: GetterCallback<T>): Getter | null {
    if (!this._port) return null;

    const { port1, port2 } = new MessageChannel();

    const request: ChildChannelRequest = [ChildChannelType.GETTER, index];

    this._port.postMessage(request, [port2]);
    port1.start();

    const remove = () => port1.postMessage(CLOSE_CHILD);

    addEventListener('unload', remove, {
      once: true,
      passive: true,
    });

    port1.onmessage = ({ data }) => {
      callback(data as T);
    };

    return {
      remove,
    };
  }

  createSetter<T>(index: number): Setter<T> | null {
    if (!this._port) return null;

    const { port1, port2 } = new MessageChannel();

    const request: ChildChannelRequest = [ChildChannelType.SETTER, index];

    this._port.postMessage(request, [port2]);
    port1.start();

    const set = (value: T) => {
      port1.postMessage(value);
    };

    const remove = () => port1.postMessage(CLOSE_CHILD);

    addEventListener('unload', remove, {
      once: true,
      passive: true,
    });

    return {
      remove,
      set,
    };
  }
}
