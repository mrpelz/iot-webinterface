import {
  autoReloadUrl,
  connectWorker,
  refreshServiceWorker,
} from './workers.js';
import { Notifications } from './notifications.js';

type SetupMessage = { initialId: string | null; interval: number };

export const CHECK_INTERVAL = 5000;
const ID_STORAGE_KEY = 'autoReloadId';

export let triggerUpdate: (() => void) | undefined;

export function autoReload(
  interval: number,
  unattended: boolean,
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

  const onReloadConfirm = () => {
    notifications.clear();
    location.reload();
  };

  const handleUpdateInstalled = () => {
    if (debug) {
      // eslint-disable-next-line no-console
      console.log('service worker cache has been refreshed');
    }

    if (unattended) {
      onReloadConfirm();

      return;
    }

    notifications.trigger(
      'New App version installed',
      {
        body: 'Click to reload',
        requireInteraction: true,
        tag: 'versionUpdate',
      },
      onReloadConfirm,
      () => notifications.clear()
    );
  };

  triggerUpdate = () => {
    if (!('serviceWorker' in navigator)) {
      handleUpdateInstalled();
      return;
    }

    refreshServiceWorker();
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

    triggerUpdate?.();
  };

  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.addEventListener('message', handleUpdateInstalled);
}
