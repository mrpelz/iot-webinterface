import { canNotify } from './notifications.js';

export const swUrl = new URL('../../workers/sw.js', import.meta.url).href;

let timeout: ReturnType<typeof setTimeout> | undefined;
let notification: Notification | undefined;

export const removeServiceWorkers = async (): Promise<void> => {
  if (!('serviceWorker' in navigator)) return;

  const cacheKeys = await caches.keys();
  for (const cacheKey of cacheKeys) {
    // eslint-disable-next-line no-await-in-loop
    await caches.delete(cacheKey);
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();

    await Promise.all(
      registrations.map((registration) => registration.unregister()),
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`error unregistering ServiceWorker: ${error}`);
  }
};

const serviceWorkerReloadNotification = () => {
  navigator.serviceWorker.addEventListener('message', ({ data }) => {
    if (
      !canNotify() ||
      typeof data !== 'number' ||
      !Number.isInteger(data) ||
      data === 0
    ) {
      location.reload();
      return;
    }

    notification?.close();
    notification = new Notification('ServiceWorker activated', {
      body: `reloading this window in ${(data / 1000).toFixed(
        0,
      )} seconds, click to abort reload`,
      requireInteraction: true,
      tag: 'reload',
    });

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      notification?.close();
      location.reload();
    }, data);

    notification.addEventListener(
      'click',
      () => {
        notification?.close();
        clearTimeout(timeout);
      },
      { once: true },
    );
  });
};

export const installServiceWorker = async (
  url_: string,
  debug: boolean,
): Promise<void> => {
  if (!('serviceWorker' in navigator)) return;

  const url = (() => {
    const result = new URL(url_);
    if (debug) result.searchParams.append('debug', '1');

    return result;
  })();

  const existingRegistration =
    await navigator.serviceWorker.getRegistration(url);

  try {
    await existingRegistration?.update();
  } catch (error) {
    if (debug) {
      // eslint-disable-next-line no-console
      console.error(`error updating ServiceWorker (${url}): ${error}`);
    }
  }

  try {
    if (debug) {
      // eslint-disable-next-line no-console
      console.debug(`registering service worker "${url.href}"`);
    }

    await navigator.serviceWorker.register(url, {
      scope: '/',
      type: 'module',
      updateViaCache: 'all',
    });

    serviceWorkerReloadNotification();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`error registering ServiceWorker (${url}): ${error}`);
  }
};
