import { connectWorker, webApiUrl } from '../util/workers.js';

type SetupMessage = {
  apiBaseUrl: string;
  interval: number;
  lowPriorityStream: boolean;
};

enum ChildChannelType {
  GETTER,
  SETTER,
}

type ChildChannelRequest = [ChildChannelType, number];

type GetterCallback<T> = (value: T) => void;
type HierarchyCallback = (value: HierarchyElement) => void;
type StreamOnlineCallback = (online: boolean) => void;

type Getter = {
  remove: () => void;
};

type Setter<T> = {
  remove: () => void;
  set: (value: T) => void;
};

type MetaKeys = 'actuator' | 'name' | 'metric' | 'type' | 'unit';
export type Meta = Partial<Record<MetaKeys, string>>;

export type HierarchyElement = {
  children?: Record<string, HierarchyElement>;
  get?: number;
  meta: Meta;
  set?: number;
};

const CLOSE_CHILD = '880E1EE9-15A2-462D-BCBC-E09630A1CFBB';
const STREAM_ONLINE = 'B41F5C2A-3F67-449F-BF91-37A3153FFFE9';
const STREAM_OFFLINE = '4A999429-B64A-4426-9818-E68039EF022D';

export class WebApi {
  private _hierarchyCallback?: HierarchyCallback;
  private readonly _port: MessagePort | null;
  private _streamOnlineCallback?: StreamOnlineCallback;

  constructor(
    apiBaseUrl: string,
    interval: number,
    lowPriorityStream: boolean,
    debug: boolean
  ) {
    this._port = connectWorker<SetupMessage>(
      webApiUrl,
      'web-api',
      {
        apiBaseUrl,
        interval,
        lowPriorityStream,
      },
      debug
    );

    (() => {
      if (!this._port) return;

      this._port.onmessage = ({ data }) => {
        if (data === STREAM_ONLINE) {
          this._streamOnlineCallback?.(true);
          return;
        }

        if (data === STREAM_OFFLINE) {
          this._streamOnlineCallback?.(false);
          return;
        }

        if (debug) {
          // eslint-disable-next-line no-console
          console.info('web-api hierarchy:', data);
        }

        this._hierarchyCallback?.(data);
      };
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

  onHierarchy(callback: HierarchyCallback): void {
    this._hierarchyCallback = callback;
  }

  onStreamOnline(callback: StreamOnlineCallback): void {
    this._streamOnlineCallback = callback;
  }
}
