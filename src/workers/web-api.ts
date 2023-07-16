/* eslint-disable no-restricted-globals */
// eslint-disable-next-line spaced-comment
/// <reference lib="WebWorker" />

import { fetchFallback, waitForServiceWorker } from './util/main.js';
import { scaffold, workerConsole } from './util/worker-scaffold.js';

(async () => {
  type SetupMessage = {
    apiBaseUrl: string;
    interval: number;
  };

  enum ChildType {
    GETTER,
    SETTER,
  }

  enum WorkerMessageType {
    STREAM,
    HIERARCHY,
    CHILD_REQUEST,
  }

  type WorkerMessageOutbound =
    | {
        online: boolean;
        type: WorkerMessageType.STREAM;
      }
    | {
        hierarchy: unknown;
        type: WorkerMessageType.HIERARCHY;
      };

  type WorkerMessageInbound = {
    childType: ChildType;
    index: number;
    type: WorkerMessageType.CHILD_REQUEST;
  };

  enum ChildMessageType {
    CLOSE,
    GET,
    SET,
  }

  type GetterMessageInbound = {
    type: ChildMessageType.CLOSE;
  };

  type GetterMessageOutbound = {
    type: ChildMessageType.GET;
    value: unknown;
  };

  type SetterMessageInbound =
    | {
        type: ChildMessageType.CLOSE;
      }
    | {
        type: ChildMessageType.SET;
        value: unknown;
      };

  type Getter = (value: unknown) => void;

  type WebSocketHandler = (data: [number, unknown]) => void;

  type Stream = {
    sendMessage: WebSocketHandler;
    setId: (id: string) => void;
  };

  const HIERARCHY_URL = '/api/hierarchy';
  const ID_URL = '/api/id';
  const WS_URL = '/api/stream';
  const WS_INTERVAL = 1000;
  const WS_MARCOPOLO_PAYLOAD = '9B864FA5-F0DE-4182-A868-B4DBB81EEC16';
  const WS_MARCOPOLO_INTERVAL = 5000;
  const WS_TIMEOUT_PADDING = 250;

  const getters = new Map<number, Set<Getter>>();
  const existingValues = new Map<number, unknown>();

  const getId = async (
    apiBaseUrl: string,
    interval: number,
    onChange: (id: string) => void
  ) => {
    const url = new URL(ID_URL, apiBaseUrl);

    const getLiveId = async () => {
      const [response] = await fetchFallback(url.href, interval, {
        cache: 'no-store',
      });
      if (!response) return null;

      const responseText = await response.text();
      return responseText.trim() || null;
    };

    let storedId: string | null = null;

    const fn = async () => {
      const id = await getLiveId();

      workerConsole.info(`id: "${id}"`);

      if (storedId === id) return;
      if (id === null) return;

      workerConsole.info(`api id changed from "${storedId}" to "${id}"`);

      storedId = id;

      onChange(id);
    };

    fn();
    setInterval(fn, interval);
  };

  const getHierarchy = async (
    apiBaseUrl: string,
    interval: number,
    id: string
  ) => {
    const url = new URL(HIERARCHY_URL, apiBaseUrl);
    url.searchParams.append('id', id);

    const hierarchy = await (async () => {
      await waitForServiceWorker();

      const [response] = await fetchFallback(url.href, interval);
      if (!response) return null;

      try {
        // eslint-disable-next-line @typescript-eslint/ban-types
        return (await response.json()) as Object;
      } catch {
        return null;
      }
    })();

    if (hierarchy) {
      workerConsole.debug('hierarchy request success');
    } else {
      workerConsole.error('hierarchy request failure');
    }

    return hierarchy;
  };

  const setupStream = (
    apiBaseUrl: string,
    handleMessage: WebSocketHandler,
    handleOnline: (online: boolean) => void
  ): Stream => {
    let storedId: string | null = null;
    let socket: WebSocket | null = null;
    let timer: number | null = null;
    let execTime: number | null = null;

    const destroyWebSocket = () => {
      socket?.close();
      socket = null;

      if (timer) clearTimeout(timer);
      timer = null;

      handleOnline(false);
    };

    const createWebSocket = () => {
      if (!storedId) return;

      if (socket?.readyState === WebSocket.OPEN) return;
      if (socket?.readyState === WebSocket.CONNECTING) return;

      const url = new URL(WS_URL, apiBaseUrl);
      url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
      url.searchParams.append('id', storedId);

      socket?.close();
      socket = (() => {
        try {
          return new WebSocket(url.href);
        } catch (error) {
          workerConsole.error(error);
          handleOnline(false);

          return null;
        }
      })();

      if (!socket) return;

      socket.onopen = () => {
        workerConsole.debug('websocket opened');
        handleOnline(true);
      };

      socket.onclose = () => {
        workerConsole.error('websocket closed');

        destroyWebSocket();
        setTimeout(() => createWebSocket(), WS_TIMEOUT_PADDING);
      };

      socket.onerror = () => {
        workerConsole.error('websocket error');

        destroyWebSocket();
        setTimeout(() => createWebSocket(), WS_TIMEOUT_PADDING);
      };

      socket.onmessage = ({ data }) => {
        if (!data) return;

        if (data === WS_MARCOPOLO_PAYLOAD) {
          if (timer) clearTimeout(timer);
          timer = setTimeout(
            () => destroyWebSocket(),
            WS_MARCOPOLO_INTERVAL + WS_TIMEOUT_PADDING
          );

          return;
        }

        const payload = (() => {
          try {
            return JSON.parse(data);
          } catch {
            return null;
          }
        })();

        if (!payload) return;

        handleMessage(payload);
      };
    };

    const sendMessage = (value: unknown) => {
      if (socket?.readyState !== WebSocket.OPEN) return;

      const message = (() => {
        try {
          return JSON.stringify(value);
        } catch {
          return null;
        }
      })();

      if (!message) return;

      socket.send(message);
    };

    const setId = (id: string) => {
      storedId = id;

      destroyWebSocket();
      setTimeout(() => createWebSocket(), WS_TIMEOUT_PADDING);
    };

    setInterval(() => {
      const now = Date.now();
      const timeSinceExec = execTime ? now - execTime : 0;
      execTime = now;

      // if worker was frozen (e.g. after PWA backgrounding on iOS),
      // detect "wakeup" and restart websocket to avoid stale TCP connection issues
      if (timeSinceExec > WS_INTERVAL + WS_TIMEOUT_PADDING) destroyWebSocket();

      createWebSocket();
    }, WS_INTERVAL);

    setInterval(() => {
      if (socket?.readyState !== WebSocket.OPEN) return;

      socket.send(WS_MARCOPOLO_PAYLOAD);
    }, WS_MARCOPOLO_INTERVAL);

    createWebSocket();

    return {
      sendMessage,
      setId,
    };
  };

  const handleMessage: WebSocketHandler = (data) => {
    if (!data) return;

    const [index, value] = data;

    existingValues.set(index, value);

    const existingGetters = getters.get(index);
    if (!existingGetters) return;

    for (const getter of existingGetters) {
      getter(value);
    }
  };

  const createGetter = (index: number, port: MessagePort) => {
    workerConsole.info(`creating getter for index ${index}`);

    const gettersForIndex = (() => {
      const existingGetters = getters.get(index);
      if (existingGetters) return existingGetters;

      const newGetters = new Set<Getter>();
      getters.set(index, newGetters);

      return newGetters;
    })();

    const getter: Getter = (value) => {
      const message: GetterMessageOutbound = {
        type: ChildMessageType.GET,
        value,
      };

      port.postMessage(message);
    };

    gettersForIndex.add(getter);

    const existingValue = existingValues.get(index);
    if (existingValue !== undefined) {
      getter(existingValue);
    }

    port.onmessage = ({ data }) => {
      const { type } = data as GetterMessageInbound;
      if (type !== ChildMessageType.CLOSE) return;

      workerConsole.info(`removing getter for index ${index}`);

      port.close();
      gettersForIndex.delete(getter);
    };
  };

  const createSetter = (
    index: number,
    port: MessagePort,
    handler: WebSocketHandler
  ) => {
    workerConsole.info(`creating setter for index ${index}`);

    port.onmessage = ({ data }) => {
      const message = data as SetterMessageInbound;
      const { type } = message;

      // eslint-disable-next-line default-case
      switch (type) {
        case ChildMessageType.CLOSE:
          workerConsole.info(`removing setter for index ${index}`);
          port.close();
          return;
        case ChildMessageType.SET:
          workerConsole.debug(
            `got setter call from index ${index}: "${message.value}"`
          );
          handler([index, message.value]);
      }
    };
  };

  let _handleStreamOnline: ((port: MessagePort) => void) | undefined;
  let _handleHierachy: ((port: MessagePort) => void) | undefined;

  (async (port: MessagePort, setup: SetupMessage | null) => {
    if (!setup) return;

    const { apiBaseUrl, interval } = setup;

    const handleStreamOnline = (online: boolean) => {
      _handleStreamOnline = (childPort) => {
        const message: WorkerMessageOutbound = {
          online,
          type: WorkerMessageType.STREAM,
        };

        childPort.postMessage(message);
      };

      _handleStreamOnline(port);
    };

    const { sendMessage, setId } = setupStream(
      apiBaseUrl,
      handleMessage,
      handleStreamOnline
    );

    port.onmessage = ({ data, ports }) => {
      const [childPort] = ports;
      if (!childPort) return;

      childPort.start();

      const { childType, index, type } = data as WorkerMessageInbound;
      if (type !== WorkerMessageType.CHILD_REQUEST) return;

      switch (childType) {
        case ChildType.GETTER:
          createGetter(index, childPort);
          return;
        case ChildType.SETTER:
          createSetter(index, childPort, (value) => sendMessage(value));
          return;
        default:
          childPort.close();
      }
    };

    await getId(apiBaseUrl, interval, async (id) => {
      const hierarchy = await getHierarchy(apiBaseUrl, interval, id);

      _handleHierachy = (childPort) => {
        const message: WorkerMessageOutbound = {
          hierarchy,
          type: WorkerMessageType.HIERARCHY,
        };

        childPort.postMessage(message);
      };

      _handleHierachy(port);

      setId(id);
    });
  })(
    ...(await scaffold<SetupMessage>(self, (port) => {
      _handleHierachy?.(port);
      _handleStreamOnline?.(port);
    }))
  );
})();
