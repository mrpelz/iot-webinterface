/* eslint-disable no-restricted-globals */
// eslint-disable-next-line spaced-comment
/// <reference lib="WebWorker" />
// eslint-disable-next-line spaced-comment,@typescript-eslint/triple-slash-reference
/// <reference path="util/worker-scaffold.ts" />

(async () => {
  importScripts('./util/worker-scaffold.js');

  const ID_URL = '/id.txt';

  type SetupMessage = {
    debug: boolean;
    initialId: string | null;
    interval: number;
  };

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

      if (liveId === null) return;
      if (storedId === liveId) return;

      workerConsole.info(
        `id changed from "${storedId}" to "${liveId}", requesting reload`
      );

      const skipReload = storedId === null;

      storedId = liveId;

      if (skipReload) return;

      port.postMessage(storedId);
    }, interval);
  })(...(await scaffold<SetupMessage>(self)));
})();
