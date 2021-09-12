/* eslint-disable no-restricted-globals */
// eslint-disable-next-line spaced-comment
/// <reference lib="WebWorker" />
// eslint-disable-next-line spaced-comment,@typescript-eslint/triple-slash-reference
/// <reference path="utils/worker-scaffold.ts" />

(async () => {
  importScripts('./utils/worker-scaffold.js');

  type SetupMessage = {
    apiBaseUrl: string;
    interval: number;
  };

  enum ChildChannelType {
    GETTER,
    SETTER,
  }

  type ChildChannelRequest = [ChildChannelType, number];

  type Getter = (value: unknown) => void;

  type WebSocketHandler = (data: [number, unknown]) => void;

  type Stream = {
    sendMessage: WebSocketHandler;
    setId: (id: string) => void;
  };

  const CLOSE_CHILD = '880E1EE9-15A2-462D-BCBC-E09630A1CFBB';
  const STREAM_ONLINE = 'B41F5C2A-3F67-449F-BF91-37A3153FFFE9';
  const STREAM_OFFLINE = '4A999429-B64A-4426-9818-E68039EF022D';

  const HIERARCHY_URL = '/api/hierarchy';
  const ID_URL = '/api/id';
  const WS_URL = '/api/stream';

  const getters = new Map<number, Set<Getter>>();
  const existingValues = new Map<number, unknown>();

  const getId = async (
    apiBaseUrl: string,
    interval: number,
    onChange: (id: string) => void
  ) => {
    const url = new URL(ID_URL, apiBaseUrl);

    const getLiveId = () =>
      fetch(url.href)
        .then((response) => (response.ok ? response.text() : null))
        .then((text) => text?.trim() || null)
        .catch(() => null);

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

  const getHierarchy = async (apiBaseUrl: string, id: string) => {
    const url = new URL(HIERARCHY_URL, apiBaseUrl);
    url.searchParams.append('id', id);

    const hierarchy = await fetch(url.href)
      .then((response) => response.json())
      .catch(() => null);

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
    let webSocket: WebSocket | null = null;

    const createWebSocket = () => {
      if (!storedId) return;

      const url = new URL(WS_URL, apiBaseUrl);
      url.protocol = 'ws';
      url.searchParams.append('id', storedId);

      try {
        if (webSocket?.readyState === WebSocket.OPEN) return;
        if (webSocket?.readyState === WebSocket.CONNECTING) return;

        webSocket?.close();
        webSocket = new WebSocket(url.href);

        webSocket.onerror = () => {
          throw new Error('webSocket onerror');
        };

        webSocket.onopen = () => {
          workerConsole.debug('websocket opened');
          handleOnline(true);
        };
        webSocket.onclose = () => {
          workerConsole.error('websocket closed');
          handleOnline(false);
        };

        webSocket.onmessage = ({ data }) => {
          if (!data) return;

          const payload = JSON.parse(data);
          if (!payload) return;

          handleMessage(payload);
        };
      } catch (error) {
        workerConsole.error(error);
        handleOnline(false);
      }
    };

    const sendMessage = (value: unknown) => {
      if (webSocket?.readyState !== WebSocket.OPEN) return;

      webSocket.send(JSON.stringify(value));
    };

    const setId = (id: string) => {
      storedId = id;

      webSocket?.close();
      createWebSocket();
    };

    setInterval(() => createWebSocket(), 2000);

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

    const { apiBaseUrl, interval } = setup;

    const handleStreamOnline = (online: boolean) => {
      port.postMessage(online ? STREAM_ONLINE : STREAM_OFFLINE);
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

      const [cmd, index] = data as ChildChannelRequest;

      switch (cmd) {
        case ChildChannelType.GETTER:
          createGetter(index, childPort);
          return;
        case ChildChannelType.SETTER:
          createSetter(index, childPort, (value) => sendMessage(value));
          return;
        default:
          childPort.close();
      }
    };

    await getId(apiBaseUrl, interval, async (id) => {
      const hierarchy = await getHierarchy(apiBaseUrl, id);
      port.postMessage(hierarchy);

      setId(id);
    });
  })(...(await scaffold<SetupMessage>(self)));
})();
