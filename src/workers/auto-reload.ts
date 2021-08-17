/* eslint-disable no-restricted-globals */
// eslint-disable-next-line spaced-comment
/// <reference lib="WebWorker" />

importScripts('./utils/worker-scaffold.js');
const ID_URL = '/id.json';

(async () => {
  (async (port: MessagePort, interval: number | null) => {
    if (!interval) return;

    const getLiveId = () =>
      fetch(ID_URL)
        .then((response) => response.json())
        .then(({ id }) => (id as number).toString())
        .catch(() => null);

    let storedId = await getLiveId();

    setInterval(async () => {
      const liveId = await getLiveId();

      if (storedId === liveId) return;
      if (liveId === null) return;

      storedId = liveId;

      port.postMessage(null);
    }, interval);
  })(...(await scaffold<number>(self)));
})();
