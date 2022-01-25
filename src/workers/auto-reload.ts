/* eslint-disable no-restricted-globals */
// eslint-disable-next-line spaced-comment
/// <reference lib="WebWorker" />
// eslint-disable-next-line spaced-comment,@typescript-eslint/triple-slash-reference
/// <reference path="util/worker-scaffold.ts" />

(async () => {
  importScripts('./util/worker-scaffold.js');

  type SetupMessage = { initialId: string | null; interval: number };

  const ID_URL = '/id.txt';
  const REFRESH_URL = '/DA6A9D49-D5E1-454D-BA19-DD53F5AA9935';

  (async (port: MessagePort, setup: SetupMessage | null) => {
    if (!setup) return;

    const { initialId, interval } = setup;

    if (!interval) return;

    const getLiveId = () => {
      try {
        return fetch(ID_URL, { credentials: 'include', redirect: 'follow' })
          .then((response) => (response.ok ? response.text() : null))
          .then((text) => text?.trim() || null)
          .catch(() => null);
      } catch {
        return Promise.resolve(null);
      }
    };

    workerConsole.info(`initial id: "${initialId}", interval: ${interval}`);

    let storedId = initialId;

    const handleUpdate = async () => {
      const ok = await (() => {
        try {
          return fetch(REFRESH_URL, { method: 'POST' })
            .then((response) => (response.ok ? response.text() : null))
            .then((responseText) => responseText === REFRESH_URL)
            .catch(() => false);
        } catch {
          return Promise.resolve(false);
        }
      })();

      port.postMessage(ok ? storedId : null);
    };

    port.onmessage = () => handleUpdate();

    setInterval(async () => {
      const liveId = await getLiveId();

      workerConsole.info(`live id: "${liveId}"`);

      if (liveId === null) return;
      if (storedId === liveId) return;

      workerConsole.info(
        `id changed from "${storedId}" to "${liveId}", requesting reload`
      );

      storedId = liveId;

      handleUpdate();
    }, interval);
  })(...(await scaffold<SetupMessage>(self)));
})();
