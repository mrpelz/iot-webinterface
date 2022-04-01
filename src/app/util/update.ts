import { connectWorker, updateUrl } from './workers.js';
import { Notifications } from './notifications.js';
import { amend } from './path.js';
import { fetchFallback } from './fetch.js';

type SetupMessage = {
  initialId: string | null;
  interval: number;
  serviceWorkerRefresh: boolean;
};

const isProd = !['localhost', '127.0.0.1'].includes(location.hostname);

export const CHECK_INTERVAL = isProd ? 60000 : 2500;
const ID_STORAGE_KEY = 'updateId';

const WARM_URL = '/1C941CA2-2CE3-48DB-B953-2DF891321BAF';
const WARM_TIMEOUT = 20000;

export const INVENTORY_URL = '/B98534B3-903F-4117-B7B7-962ABDAC4C42';
export const ECHO_URL = '/E4B38FA2-08D2-4117-9738-29FC9106CBA0';

const getInitialId = () => localStorage.getItem(ID_STORAGE_KEY);

export let triggerUpdate: (() => void) | undefined;
let clearNotifications: (() => void) | undefined;

export const reload: () => void = () => {
  clearNotifications?.();

  history.replaceState(undefined, '', amend('/'));
  location.reload();
};

export const update = (
  interval: number | null,
  unattended: boolean,
  notifications: Notifications,
  serviceWorkerRefresh: boolean,
  debug: boolean
): void => {
  const port = connectWorker<SetupMessage>(
    updateUrl,
    'update',
    {
      initialId: getInitialId(),
      interval: interval === null ? CHECK_INTERVAL : interval,
      serviceWorkerRefresh,
    },
    debug
  );

  if (!port) return;

  triggerUpdate = () => port.postMessage(null);
  clearNotifications = () => notifications.clear();

  port.onmessage = async ({ data }) => {
    const newId = data as string | null;

    if (newId === null) {
      if (debug) {
        // eslint-disable-next-line no-console
        console.info(
          'received reload request indicating no service worker is present'
        );
      }

      if (unattended) {
        reload();

        return;
      }

      notifications.trigger(
        'No new App version installed',
        {
          body: 'Service worker not present',
          requireInteraction: false,
          tag: 'versionUpdate',
        },
        reload,
        () => notifications.clear()
      );

      return;
    }

    if (debug) {
      // eslint-disable-next-line no-console
      console.info(`received reload request with new id "${newId}"`);
    }

    const initialId = getInitialId();
    localStorage.setItem(ID_STORAGE_KEY, newId);

    if (initialId === null) return;

    notifications.clear();

    if (unattended) {
      reload();

      return;
    }

    notifications.trigger(
      'New App version installed',
      {
        body: newId,
        requireInteraction: true,
        tag: 'versionUpdate',
      },
      reload,
      () => notifications.clear()
    );
  };
};

export const warm = (): void => {
  fetchFallback(WARM_URL, WARM_TIMEOUT, { method: 'POST' });
};
