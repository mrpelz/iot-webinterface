import { expose } from 'comlink';
import { precacheAndRoute } from 'workbox-precaching';

import type { SW_API } from '../common/types.js';
import { getFlags } from './util.js';

declare const self: ServiceWorkerGlobalScope;

const NOTIFICATION_SERVICEWORKER_INSTALL_TAG =
  'notificationServiceWorkerInstall';
const NOTIFICATION_SERVICEWORKER_ACTIVATE_TAG =
  'notificationServiceWorkerActivate';
const NOTIFICATION_SERVICEWORKER_ACTIVATE_ACTION_ABORT =
  'notificationServiceWorkerActivateActionAbort';

const manifest = self.__WB_MANIFEST;

precacheAndRoute(manifest, {
  urlManipulation: ({ url }) => {
    const { pathname } = url;
    const pathChunks = pathname.slice(1).split('/');

    if (pathChunks[0] !== 'api' && !pathname.includes('.')) {
      url.pathname = '/index.html';
    }

    return [url];
  },
});

const clearNotifications = async (tags?: string[]) => {
  const { debug } = await getFlags();

  // eslint-disable-next-line no-console
  if (debug) console.debug('remove clearNotifications', tags);

  const notifications = tags
    ? await Promise.all(
        tags.map((tag) => self.registration.getNotifications({ tag })),
      ).then((result) => result.flat(1))
    : await self.registration.getNotifications();

  for (const notification of notifications) {
    notification.close();
  }
};

const reload = async () => {
  const { debug } = await getFlags();

  // eslint-disable-next-line no-console
  if (debug) console.debug('reload');

  const windowClients = await self.clients.matchAll({ type: 'window' });

  for (const windowClient of windowClients) {
    try {
      windowClient.navigate(windowClient.url).catch(() => {
        // noop
      });
    } catch {
      // noop
    }
  }
};

const removeRegistration = async () => {
  const { debug } = await getFlags();

  // eslint-disable-next-line no-console
  if (debug) console.debug('removeRegistration');

  const cacheNames = await self.caches.keys();

  await Promise.all(
    cacheNames.map((cacheName) => self.caches.delete(cacheName)),
  );

  await self.registration.unregister();
  await reload();
};

const api: SW_API = {
  clearNotifications,
  reload,
  removeRegistration,
  showNotification: async (...args) => {
    const { debug } = await getFlags();

    // eslint-disable-next-line no-console
    if (debug) console.debug('showNotification', ...args);

    return self.registration.showNotification(...args);
  },
};

self.addEventListener('install', (event) =>
  event.waitUntil(
    (async () => {
      const flags = await getFlags();

      if (flags.debug) {
        // eslint-disable-next-line no-console
        console.debug('install event');

        // eslint-disable-next-line no-console
        console.table(flags);
      }

      await clearNotifications([
        NOTIFICATION_SERVICEWORKER_INSTALL_TAG,
        NOTIFICATION_SERVICEWORKER_ACTIVATE_TAG,
      ]);

      self.registration
        .showNotification('New Version Downloading', {
          body: 'A new version is pre-cached for offline-use',
          tag: NOTIFICATION_SERVICEWORKER_INSTALL_TAG,
        })
        .catch(() => {
          // noop
        });

      await self.skipWaiting();
    })(),
  ),
);

self.addEventListener('activate', (event) =>
  event.waitUntil(
    (async () => {
      const { debug } = await getFlags();

      // eslint-disable-next-line no-console
      if (debug) console.debug('activate event');

      await self.clients.claim();

      await clearNotifications([
        NOTIFICATION_SERVICEWORKER_INSTALL_TAG,
        NOTIFICATION_SERVICEWORKER_ACTIVATE_TAG,
      ]);

      const { updateUnattended } = await getFlags();

      if (updateUnattended) {
        await reload();
        return;
      }

      self.registration
        .showNotification('Activate New Version?', {
          actions: [
            {
              action: NOTIFICATION_SERVICEWORKER_ACTIVATE_ACTION_ABORT,
              title: 'Do Not Reload',
            },
          ],
          body: 'Reload all windows to make use of new version?',
          requireInteraction: true,
          tag: NOTIFICATION_SERVICEWORKER_ACTIVATE_TAG,
        } as NotificationOptions & {
          actions: { action: string; title: string }[];
        })
        .catch(() => {
          // noop
        });
    })(),
  ),
);

self.addEventListener('notificationclick', (event) =>
  event.waitUntil(
    (async () => {
      const {
        action,
        notification: { tag },
      } = event;

      const { debug } = await getFlags();

      // eslint-disable-next-line no-console
      if (debug) console.debug('notificationclick event', action, tag);

      if (tag !== NOTIFICATION_SERVICEWORKER_ACTIVATE_TAG) return;

      await clearNotifications([
        NOTIFICATION_SERVICEWORKER_INSTALL_TAG,
        NOTIFICATION_SERVICEWORKER_ACTIVATE_TAG,
      ]);

      if (action === NOTIFICATION_SERVICEWORKER_ACTIVATE_ACTION_ABORT) return;

      await reload();
    })(),
  ),
);

let clients: Client[] = [];

expose(api, {
  addEventListener(
    type: 'message',
    listener: (
      this: ServiceWorkerGlobalScope,
      event: ExtendableMessageEvent,
    ) => Promise<void>,
  ): void {
    self.addEventListener(type, (event) => {
      event.waitUntil(
        (async () => {
          clients = [await self.clients.matchAll()].flat();

          await listener.apply(self, [event]);
        })(),
      );
    });
  },
  postMessage(message: unknown, transfer: Transferable[] = []): void {
    for (const client of clients) {
      client.postMessage(message, transfer);
    }
  },
  removeEventListener: self.removeEventListener,
});
