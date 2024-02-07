import { defer, fetchFallback, workerConsole } from './util.js';

declare const self: SharedWorkerGlobalScope & typeof globalThis;

type SetupMessage = {
  initialId: string | null;
  interval: number;
};

type Update = {
  id: string;
  time: number;
};

const ID_URL = '/dist/update.json';

const REFRESH_URL = '/DA6A9D49-D5E1-454D-BA19-DD53F5AA9935';
const REFRESH_TIMEOUT = 20_000;

const INTERVAL = 5000;

const isUpdate = (input: unknown): input is Update => {
  if (!input) return false;
  if (typeof input !== 'object') return false;

  if (!('id' in input)) return false;
  if (typeof input.id !== 'string') return false;

  if (!('time' in input)) return false;
  if (typeof input.time !== 'number') return false;

  return true;
};

const _fn = async (port: MessagePort, setup: SetupMessage | null) => {
  if (!setup) return;

  const { initialId, interval } = setup;

  const getUpdate = async () => {
    const [response] = await fetchFallback(ID_URL, interval || INTERVAL, {
      cache: 'no-store',
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'x-sw-skip': '1',
      },
    });
    if (!response) return null;

    return response.json();
  };

  workerConsole.info(`initial id: "${initialId}", interval: ${interval}`);

  let storedId = initialId;

  const handleUpdate = async (delay: number) => {
    const ok = await (async () => {
      const url = new URL(REFRESH_URL, self.location.href);
      url.searchParams.set('delay', delay.toString());

      const [response] = await fetchFallback(url, REFRESH_TIMEOUT, {
        method: 'POST',
      });
      if (!response) return false;

      const responseText = await response.text();

      return responseText.trim() === REFRESH_URL;
    })();

    port.postMessage(ok ? storedId : null);
  };

  const checkForUpdate = async () => {
    const update = await getUpdate();
    if (!isUpdate(update)) return;

    const { id, time } = update;

    workerConsole.info(`live id: "${id}", time: ${time}`);

    if (storedId === id) return;

    workerConsole.info(
      `id changed from "${storedId}" to "${id}", requesting reload`,
    );

    storedId = id;

    handleUpdate(time);
  };

  port.addEventListener('message', () => handleUpdate(0));

  if (interval) setInterval(() => checkForUpdate(), interval);
  defer(() => checkForUpdate());
};
