import {
  autoReloadUrl,
  connectWorker,
  refreshServiceWorker,
} from './workers.js';
import { Notifications } from './notifications.js';

type SetupMessage = { initialId: string | null; interval: number };

export const CHECK_INTERVAL = 2000;
const ID_STORAGE_KEY = 'autoReloadId';

export function autoReload(
  interval: number,
  notifications: Notifications,
  debug: boolean
): void {
  const initialId = localStorage.getItem(ID_STORAGE_KEY);

  const port = connectWorker<SetupMessage>(
    autoReloadUrl,
    'auto-reload',
    {
      initialId,
      interval,
    },
    debug
  );

  if (!port) return;

  const notification = () => {
    notifications.trigger(
      'New App version installed',
      {
        body: 'Click to reload',
        requireInteraction: true,
        tag: 'versionUpdate',
      },
      () => {
        notifications.clear();
        location.reload();
      },
      () => notifications.clear()
    );
  };

  port.onmessage = async ({ data: storedId }) => {
    if (debug) {
      // eslint-disable-next-line no-console
      console.info(`received reload request with new id "${storedId}"`);
    }

    notifications.clear();

    localStorage.setItem(ID_STORAGE_KEY, String(storedId));

    if ('serviceWorker' in navigator) {
      const serviceWorker = await navigator.serviceWorker.ready;
      await serviceWorker.update();
    }

    refreshServiceWorker();

    if ('serviceWorker' in navigator) return;
    notification();
  };

  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.addEventListener('message', () => notification());
}
