import { autoReloadUrl, connectWorker } from './workers.js';
import { Notifications } from './notifications.js';

type SetupMessage = { initialId: string | null; interval: number };

export const CHECK_INTERVAL = 5000;
const ID_STORAGE_KEY = 'autoReloadId';

const getInitialId = () => localStorage.getItem(ID_STORAGE_KEY);

export let triggerUpdate: (() => void) | undefined;

export function autoReload(
  interval: number | null,
  unattended: boolean,
  notifications: Notifications,
  debug: boolean
): void {
  if (interval === 0) return;

  const port = connectWorker<SetupMessage>(
    autoReloadUrl,
    'auto-reload',
    {
      initialId: getInitialId(),
      interval: interval === null ? CHECK_INTERVAL : interval,
    },
    debug
  );

  if (!port) return;

  triggerUpdate = () => port.postMessage(null);

  const onReloadConfirm = () => {
    notifications.clear();
    location.reload();
  };

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
        onReloadConfirm();

        return;
      }

      notifications.trigger(
        'No new App version installed',
        {
          body: 'Service worker not present',
          requireInteraction: true,
          tag: 'versionUpdate',
        },
        onReloadConfirm,
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
}
