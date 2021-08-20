import {
  autoReloadUrl,
  connectWorker,
  refreshServiceWorker,
} from './workers.js';
import { canNotify } from './notifications.js';

type SetupMessage = { initialId: string | null; interval: number };

export const CHECK_INTERVAL = 10000;
export const ID_STORAGE_KEY = 'autoReloadId';

export function autoReload(interval: number, notifications: boolean): void {
  const initialId = localStorage.getItem(ID_STORAGE_KEY);

  const port = connectWorker<SetupMessage>(autoReloadUrl, 'auto-reload', {
    initialId,
    interval,
  });

  if (!port) return;

  port.onmessage = async ({ data: storedId }) => {
    // eslint-disable-next-line no-console
    console.info(`received reload request with new id "${storedId}"`);

    localStorage.setItem(ID_STORAGE_KEY, String(storedId));

    if ('serviceWorker' in navigator) {
      const serviceWorker = await navigator.serviceWorker.ready;
      await serviceWorker.update();
    }

    refreshServiceWorker();

    if (
      !notifications ||
      !canNotify() ||
      document.visibilityState !== 'visible' ||
      !document.hasFocus()
    ) {
      location.reload();

      return;
    }

    const notification = new Notification('New App version installed', {
      body: 'Click to reload',
      requireInteraction: true,
      tag: 'versionUpdate',
    });

    const handleNotificationClick = () => {
      notification.close();
      location.reload();
    };

    notification.addEventListener('click', handleNotificationClick, {
      once: true,
      passive: true,
    });

    addEventListener('unload', () => notification.close(), {
      once: true,
      passive: true,
    });
  };
}
