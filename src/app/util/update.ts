import { connectWorker } from './workers.js';

type SetupMessage = {
  initialId: string | null;
  interval: number;
};

const updateUrl = new URL('../../workers/update.js', import.meta.url).href;

export const isProd = !['localhost', '127.0.0.1'].includes(location.hostname);

export const CHECK_INTERVAL = isProd ? 15_000 : 1000;
const ID_STORAGE_KEY = 'updateId';

const getInitialId = () => localStorage.getItem(ID_STORAGE_KEY);

export let triggerUpdate: (() => void) | undefined;

export const update = (interval: number | null, debug: boolean): void => {
  const port = connectWorker<SetupMessage>(
    updateUrl,
    'update',
    {
      initialId: getInitialId(),
      interval: interval === null ? CHECK_INTERVAL : interval,
    },
    debug,
  );

  if (!port) return;

  triggerUpdate = () => port.postMessage(null);

  port.addEventListener('message', async ({ data }) => {
    const newId = data as string | null;

    if (newId === null) {
      if (debug) {
        // eslint-disable-next-line no-console
        console.info(
          'received reload request indicating no service worker is present',
        );
      }

      return;
    }

    if (debug) {
      // eslint-disable-next-line no-console
      console.info(`received reload request with new id "${newId}"`);
    }

    localStorage.setItem(ID_STORAGE_KEY, newId);
  });
};
