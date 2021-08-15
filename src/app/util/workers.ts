const UNLOAD = 'BA51CF3C-0145-45A6-B418-41F275DCFA32';

const SW_PATH = '../../workers/sw.js';
export const SHARED_PATH = '../../workers/shared.js';

export function removeServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return;

  (async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        registration.unregister();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`error unregistering ServiceWorker: ${error}`);
    }
  })();
}

export function installServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return;

  const url = new URL(SW_PATH, import.meta.url).href;

  (async () => {
    try {
      if (await navigator.serviceWorker.getRegistration(url)) return;

      await navigator.serviceWorker.register(url, {
        scope: '/',
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`error registering ServiceWorker (${url}): ${error}`);
    }
  })();
}

export function getSharedWorker(
  path: string,
  name: string
): SharedWorker | null {
  const url = new URL(path, import.meta.url).href;

  const worker = (() => {
    try {
      return new SharedWorker(url, {
        name,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`error getting SharedWorker "${name}" (${url}): ${error}`);

      return null;
    }
  })();

  if (worker) {
    addEventListener('unload', () => worker.port.postMessage(UNLOAD), {
      once: true,
      passive: true,
    });
  }

  return worker;
}
