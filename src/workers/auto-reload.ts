/* eslint-disable no-restricted-globals */
// eslint-disable-next-line spaced-comment
/// <reference lib="WebWorker" />
// eslint-disable-next-line spaced-comment,@typescript-eslint/triple-slash-reference
/// <reference path="utils/worker-scaffold.ts" />

(async () => {
  importScripts('./utils/worker-scaffold.js');

  const ID_URL = '/id.txt';

  type SetupMessage = { initialId: string | null; interval: number };

  (async (port: MessagePort, setup: SetupMessage | null) => {
    if (!setup) return;

    const { initialId, interval } = setup;
    if (!interval) return;

    const getLiveId = () =>
      fetch(ID_URL)
        .then((response) => (response.ok ? response.text() : null))
        .then((text) => text?.trim() || null)
        .catch(() => null);

    workerConsole.info(`initial id: "${initialId}", interval: ${interval}`);

    let storedId = initialId;

    setInterval(async () => {
      const liveId = await getLiveId();

      workerConsole.info(`live id: "${liveId}"`);

      if (storedId === liveId) return;
      if (liveId === null) return;

      workerConsole.info(
        `id changed from "${storedId}" to "${liveId}", requesting reload`
      );

      storedId = liveId;

      port.postMessage(storedId);
    }, interval);
  })(...(await scaffold<SetupMessage>(self)));
})();
