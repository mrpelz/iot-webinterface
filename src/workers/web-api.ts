/* eslint-disable no-restricted-globals */
// eslint-disable-next-line spaced-comment
/// <reference lib="WebWorker" />
// eslint-disable-next-line spaced-comment,@typescript-eslint/triple-slash-reference
/// <reference path="utils/worker-scaffold.ts" />

(async () => {
  importScripts('./utils/worker-scaffold.js');

  type SetupMessage = { apiBaseUrl: string; lowPriorityStream: boolean };

  enum ChildChannelType {
    GETTER,
    SETTER,
  }

  type ChildChannelRequest = [ChildChannelType, number];

  type Getter = (value: unknown) => void;

  type WebSocketHandler = (data: [number, unknown]) => void;

  const CLOSE_CHILD = '880E1EE9-15A2-462D-BCBC-E09630A1CFBB';
  const HIERARCHY_URL = '/api/hierarchy';
  const ID_URL = '/api/id';
  const WS_URL = '/api/stream';

  const getters = new Map<number, Set<Getter>>();
  const existingValues = new Map<number, unknown>();

  const getId = async (apiBaseUrl: string) => {
    const url = new URL(ID_URL, apiBaseUrl);

    const result = await fetch(url.href)
      .then((response) => response.text())
      .catch(() => null);

    workerConsole.info(`api id: "${result}"`);

    return result;
  };

  const getHierarchy = async (apiBaseUrl: string, id: string) => {
    const url = new URL(HIERARCHY_URL, apiBaseUrl);
    url.searchParams.append('id', id);

    const result = await fetch(url.href)
      .then((response) => response.json())
      .catch(() => null);

    if (result) {
      workerConsole.debug('hierarchy request success');
    } else {
      workerConsole.error('hierarchy request failure');
    }

    return result;
  };

  const setupStream = (
    apiBaseUrl: string,
    id: string,
    lowPriorityStream: boolean,
    handleMessage: WebSocketHandler
  ): WebSocketHandler => {
    const url = new URL(WS_URL, apiBaseUrl);
    url.protocol = 'ws';
    url.searchParams.append('id', id);

    if (lowPriorityStream) url.searchParams.append('lowPriority', '1');

    let webSocket: WebSocket | null = null;

    const createWebSocket = () => {
      try {
        if (webSocket?.readyState === WebSocket.OPEN) return;
        if (webSocket?.readyState === WebSocket.CONNECTING) return;

        webSocket?.close();
        webSocket = new WebSocket(url.href);

        webSocket.onerror = () => {
          throw new Error('webSocket onerror');
        };

        webSocket.onopen = () => workerConsole.debug('websocket opened');
        webSocket.onclose = () => workerConsole.error('websocket closed');

        webSocket.onmessage = ({ data }) => {
          if (!data) return;

          const payload = JSON.parse(data);
          if (!payload) return;

          handleMessage(payload);
        };
      } catch (error) {
        workerConsole.error(error);
      }
    };

    createWebSocket();

    setInterval(() => createWebSocket(), 2000);

    return (value) => {
      if (webSocket?.readyState !== WebSocket.OPEN) return;

      webSocket.send(JSON.stringify(value));
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
      port.postMessage(value);
    };

    gettersForIndex.add(getter);

    const existingValue = existingValues.get(index);
    if (existingValue !== undefined) {
      getter(existingValue);
    }

    port.onmessage = ({ data: value }) => {
      if (value !== CLOSE_CHILD) return;

      workerConsole.info(`removing getter for index ${index}`);

      port.close();
      gettersForIndex.delete(getter);
    };
  };

  const createSetter = (
    index: number,
    port: MessagePort,
    callback: WebSocketHandler
  ) => {
    workerConsole.info(`creating setter for index ${index}`);

    port.onmessage = ({ data: value }) => {
      if (value === CLOSE_CHILD) {
        workerConsole.info(`removing setter for index ${index}`);

        port.close();

        return;
      }

      workerConsole.debug(`got setter call from index ${index}: "${value}"`);

      callback([index, value]);
    };
  };

  (async (port: MessagePort, setup: SetupMessage | null) => {
    if (!setup) return;

    const { apiBaseUrl, lowPriorityStream } = setup;

    let streamHandler: WebSocketHandler | null = null;

    port.onmessage = ({ data, ports }) => {
      const [childPort] = ports;
      if (!childPort) return;

      childPort.start();

      const [cmd, index] = data as ChildChannelRequest;

      switch (cmd) {
        case ChildChannelType.GETTER:
          createGetter(index, childPort);
          return;
        case ChildChannelType.SETTER:
          createSetter(index, childPort, (value) => streamHandler?.(value));
          return;
        default:
          childPort.close();
      }
    };

    const id = await getId(apiBaseUrl);
    if (!id) return;

    const hierarchy = await getHierarchy(apiBaseUrl, id);
    if (!hierarchy) return;

    port.postMessage(hierarchy);

    streamHandler = setupStream(
      apiBaseUrl,
      id,
      lowPriorityStream,
      handleMessage
    );
  })(...(await scaffold<SetupMessage>(self)));
})();