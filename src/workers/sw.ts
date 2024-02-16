import { precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;

const NOTIFICATION_SERVICEWORKER_INSTALL_TAG =
  'notificationServiceWorkerInstall';
const NOTIFICATION_SERVICEWORKER_ACTIVATE_TAG =
  'notificationServiceWorkerActivate';
const NOTIFICATION_SERVICEWORKER_ACTIVATE_ACTION_ABORT =
  'notificationServiceWorkerActivateActionAbort';

const clearNotifications = async (tags?: string[]) => {
  const notifications = tags
    ? await Promise.all(
        tags.map((tag) => self.registration.getNotifications({ tag })),
      ).then((result) => result.flat(1))
    : await self.registration.getNotifications();

  for (const notification of notifications) {
    notification.close();
  }
};

precacheAndRoute(self.__WB_MANIFEST, {
  urlManipulation: ({ url }) => {
    const { pathname } = url;
    const pathChunks = pathname.slice(1).split('/');

    if (pathChunks[0] !== 'api' && !pathname.includes('.')) {
      url.pathname = '/index.html';
    }

    return [url];
  },
});

self.addEventListener('install', (event) =>
  event.waitUntil(
    (async () => {
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
      await clearNotifications([
        NOTIFICATION_SERVICEWORKER_INSTALL_TAG,
        NOTIFICATION_SERVICEWORKER_ACTIVATE_TAG,
      ]);

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

      if (tag !== NOTIFICATION_SERVICEWORKER_ACTIVATE_TAG) return;

      await clearNotifications([
        NOTIFICATION_SERVICEWORKER_INSTALL_TAG,
        NOTIFICATION_SERVICEWORKER_ACTIVATE_TAG,
      ]);

      if (action === NOTIFICATION_SERVICEWORKER_ACTIVATE_ACTION_ABORT) return;

      const windowClients = await self.clients.matchAll({ type: 'window' });

      for (const windowClient of windowClients) {
        try {
          windowClient.navigate(windowClient.url);
        } catch {
          // noop
        }
      }
    })(),
  ),
);
