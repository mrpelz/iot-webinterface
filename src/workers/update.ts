/* eslint-disable no-restricted-globals */
// eslint-disable-next-line spaced-comment
/// <reference lib="WebWorker" />
// eslint-disable-next-line spaced-comment,@typescript-eslint/triple-slash-reference
/// <reference path="util/worker-scaffold.ts" />
// eslint-disable-next-line spaced-comment,@typescript-eslint/triple-slash-reference
/// <reference path="util/main.ts" />

(async () => {
  importScripts('./util/worker-scaffold.js');
  importScripts('./util/main.js');

  type SetupMessage = { initialId: string | null; interval: number };

  const ID_URL = '/id.txt';
  const REFRESH_URL = '/DA6A9D49-D5E1-454D-BA19-DD53F5AA9935';

  (async (port: MessagePort, setup: SetupMessage | null) => {
    if (!setup) return;

    const { initialId, interval } = setup;

    if (!interval) return;

    const getLiveId = async () => {
      const response = await fetchFallback(ID_URL, interval);
      if (!response) return null;

      const responseText = await response.text();
      return responseText.trim() || null;
    };

    workerConsole.info(`initial id: "${initialId}", interval: ${interval}`);

    let storedId = initialId;

    const handleUpdate = async () => {
      const ok = await (async () => {
        const response = await fetchFallback(REFRESH_URL, 20000, {
          method: 'POST',
        });
        if (!response) return false;

        const responseText = await response.text();

        return responseText.trim() === REFRESH_URL;
      })();

      port.postMessage(ok ? storedId : null);
    };

    const checkForUpdate = async () => {
      const liveId = await getLiveId();

      workerConsole.info(`live id: "${liveId}"`);

      if (liveId === null) return;
      if (storedId === liveId) return;

      workerConsole.info(
        `id changed from "${storedId}" to "${liveId}", requesting reload`
      );

      storedId = liveId;

      handleUpdate();
    };

    port.onmessage = () => handleUpdate();

    setInterval(() => checkForUpdate(), interval);
    defer(() => checkForUpdate());
  })(...(await scaffold<SetupMessage>(self)));
})();
