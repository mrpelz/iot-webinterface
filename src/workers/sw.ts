import { Endpoint, expose } from 'comlink';
import { precacheAndRoute } from 'workbox-precaching';

import type { SW_API } from '../common/types.js';
import { getFlags, ntfyApiRequest } from './util.js';

export const slug = /** {slug} */ '<slug>';
export const webpackServe = /** {webpackServe} */ false;

type NotificationOptionsExtended = NotificationOptions & {
  actions: { action: string; title: string }[];
  renotify?: boolean;
};

declare const self: ServiceWorkerGlobalScope;

const NOTIFICATION_SERVICEWORKER_NEW_VERSION_TAG =
  'notificationServiceWorkerNewVersion';
const NOTIFICATION_SERVICEWORKER_ACTIVATE_ACTION_ABORT =
  'notificationServiceWorkerActivateActionAbort';
const pushTopicSystem = `${slug}-system`;

self.__WB_DISABLE_DEV_LOGS = true;
const manifest = self.__WB_MANIFEST;

precacheAndRoute(manifest, {
  urlManipulation: ({ url }) => {
    const { pathname } = url;
    const pathChunks = pathname.slice(1).split('/');

    if (
      pathChunks[0] !== 'api' &&
      !pathname.startsWith('/__') &&
      !pathname.includes('.')
    ) {
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
      ).then((result) => result.flat())
    : await self.registration.getNotifications();

  for (const notification of notifications) {
    notification.close();
  }
};

const pushSubscribe = async (topics_: string[] = []) => {
  const { debug } = await getFlags();

  const { pushManager } = self.registration;

  const existingSubscription = await pushManager.getSubscription();

  const applicationServerKey = existingSubscription
    ? undefined
    : await ntfyApiRequest('/config').then((result) =>
        result &&
        'web_push_public_key' in result &&
        typeof result.web_push_public_key === 'string'
          ? result.web_push_public_key
          : undefined,
      );

  const pushSubscription = (
    existingSubscription ??
    (await pushManager.subscribe({
      applicationServerKey,
      userVisibleOnly: true,
    }))
  ).toJSON();

  const topics = [topics_, [pushTopicSystem]].flat();

  const result =
    pushSubscription.endpoint &&
    pushSubscription.keys?.auth &&
    pushSubscription.keys.p256dh
      ? await ntfyApiRequest('/webpush', {
          body: JSON.stringify({
            auth: pushSubscription.keys.auth,
            endpoint: pushSubscription.endpoint,
            p256dh: pushSubscription.keys.p256dh,
            topics,
          }),
          method: 'POST',
        })
      : undefined;

  const success = Boolean(result && 'success' in result && result.success);

  if (debug) {
    // eslint-disable-next-line no-console
    console.debug('pushSubscribe', {
      applicationServerKey,
      pushSubscription,
      success,
      topics,
    });
  }

  return {
    applicationServerKey,
    pushSubscription,
    success,
    topics,
  };
};

let isReloading = false;
const reload = async (open?: boolean) => {
  if (isReloading) return;
  isReloading = true;

  const { debug } = await getFlags();

  // eslint-disable-next-line no-console
  if (debug) console.debug('reload');

  const windowClients = await self.clients.matchAll({ type: 'window' });

  for (const windowClient of windowClients) {
    try {
      windowClient.navigate(windowClient.url).catch();
    } catch {
      // noop
    }
  }

  if (open) {
    const firstClient = windowClients.at(0);
    if (firstClient) {
      await firstClient.focus();
    } else {
      await self.clients.openWindow('/').catch();
    }
  }

  // eslint-disable-next-line require-atomic-updates
  isReloading = false;
};

const removeRegistration = async () => {
  const { debug } = await getFlags();

  // eslint-disable-next-line no-console
  if (debug) console.debug('removeRegistration');

  const cacheNames = await self.caches.keys();

  await Promise.all(
    cacheNames.map((cacheName) => self.caches.delete(cacheName)),
  );

  const pushSubscription =
    await self.registration.pushManager.getSubscription();
  await pushSubscription?.unsubscribe();

  await self.registration.unregister();
  await reload();
};

const showNotification: ServiceWorkerRegistration['showNotification'] = async (
  title,
  options,
) => {
  const { debug } = await getFlags();

  // eslint-disable-next-line no-console
  if (debug) console.debug('showNotification', title, options);

  return self.registration.showNotification(title, options);
};

const api: SW_API = {
  clearNotifications,
  pushSubscribe,
  reload,
  removeRegistration,
  showNotification,
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

      await clearNotifications([NOTIFICATION_SERVICEWORKER_NEW_VERSION_TAG]);

      if (!flags.updateUnattended && !webpackServe) {
        showNotification('New Version Downloading', {
          body: 'A new version is pre-cached for offline-use',
          renotify: true,
          tag: NOTIFICATION_SERVICEWORKER_NEW_VERSION_TAG,
        } as NotificationOptionsExtended).catch(() => {
          // noop
        });
      }

      await self.skipWaiting();
    })(),
  ),
);

self.addEventListener('activate', (event) =>
  event.waitUntil(
    (async () => {
      await self.clients.claim();

      const flags = await getFlags();

      // eslint-disable-next-line no-console
      if (flags.debug) console.debug('activate event');

      await clearNotifications([NOTIFICATION_SERVICEWORKER_NEW_VERSION_TAG]);

      if (webpackServe) return;

      if (flags.updateUnattended) {
        await reload();
        return;
      }

      showNotification('Activate New Version?', {
        actions: [
          {
            action: NOTIFICATION_SERVICEWORKER_ACTIVATE_ACTION_ABORT,
            title: 'Do Not Reload',
          },
        ],
        body: 'Reload all windows to make use of new version?',
        renotify: true,
        requireInteraction: true,
        tag: NOTIFICATION_SERVICEWORKER_NEW_VERSION_TAG,
      } as NotificationOptionsExtended).catch(() => {
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

      if (tag !== NOTIFICATION_SERVICEWORKER_NEW_VERSION_TAG) return;

      await clearNotifications([NOTIFICATION_SERVICEWORKER_NEW_VERSION_TAG]);

      if (action === NOTIFICATION_SERVICEWORKER_ACTIVATE_ACTION_ABORT) return;

      await reload(true);
    })(),
  ),
);

self.addEventListener('push', (event) =>
  event.waitUntil(
    (async () => {
      const { data } = event;

      const { debug } = await getFlags();

      const payload = await data?.json();

      // eslint-disable-next-line no-console
      if (debug) console.debug('push event', payload);

      if (!payload || payload.event !== 'message' || !('message' in payload)) {
        await showNotification('Empty Push', {
          body: 'Received non-displayable push message',
        });
        return;
      }

      const { message = '', tags = [], title = '' } = payload.message;
      const tag = Array.isArray(tags) ? tags.at(0) : undefined;

      if (tag === NOTIFICATION_SERVICEWORKER_NEW_VERSION_TAG) {
        await self.registration.update();
      }

      if (tag) await clearNotifications([tag]);
      await showNotification(title, {
        body: message,
        tag,
      });
    })(),
  ),
);

let clients: readonly Client[] = [];

expose(api, {
  addEventListener: (
    type: 'message',
    listener: (event: ExtendableMessageEvent) => void,
  ): void => {
    self.addEventListener(type, (event) => {
      event.waitUntil(
        (async () => {
          await self.clients.claim();
          clients = await self.clients.matchAll();

          await listener.apply(self, [event]);
        })(),
      );
    });
  },
  postMessage: (message, transfer): void => {
    for (const client of clients) {
      client.postMessage(message, transfer ?? []);
    }
  },
  removeEventListener: self.removeEventListener,
} as Endpoint);
