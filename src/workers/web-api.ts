/* eslint-disable no-restricted-globals */
// eslint-disable-next-line spaced-comment
/// <reference lib="WebWorker" />
// eslint-disable-next-line spaced-comment,@typescript-eslint/triple-slash-reference
/// <reference path="utils/worker-scaffold.ts" />

(async () => {
  importScripts('./utils/worker-scaffold.js');

  enum WebApiCommands {
    HIERARCHY,
    UPDATE,
  }

  const HIERARCHY_URL = '/api/hierarchy';
  const ID_URL = '/api/id';
  const WS_URL = '/api/stream';

  type SetupMessage = { apiBaseUrl: string; lowPriorityStream: boolean };

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

    return result;
  };

  const setupStream = (
    apiBaseUrl: string,
    id: string,
    lowPriorityStream: boolean,
    handleMessage: (data: unknown) => void
  ) => {
    const url = new URL(WS_URL, apiBaseUrl);
    url.protocol = 'ws';
    url.searchParams.append('id', id);

    if (lowPriorityStream) url.searchParams.append('lowPriority', '1');

    try {
      const webSocket = new WebSocket(url.href);

      webSocket.onerror = () => {
        throw new Error('webSocket onerror');
      };

      webSocket.onmessage = ({ data }) => handleMessage(data);
    } catch (error) {
      workerConsole.error(error);
    }
  };

  (async (port: MessagePort, setup: SetupMessage | null) => {
    if (!setup) return;

    const { apiBaseUrl, lowPriorityStream } = setup;

    const id = await getId(apiBaseUrl);
    if (!id) return;

    const hierarchy = await getHierarchy(apiBaseUrl, id);
    if (!hierarchy) return;

    port.postMessage([WebApiCommands.HIERARCHY, hierarchy]);

    setupStream(apiBaseUrl, id, lowPriorityStream, (payload) => {
      const data = (() => {
        try {
          return JSON.parse(payload as string);
        } catch (error) {
          return null;
        }
      })() as [number, unknown] | null;

      if (!data) return;

      const [key, value] = data;

      port.postMessage([WebApiCommands.UPDATE, key, value]);
    });
  })(...(await scaffold<SetupMessage>(self)));
})();
