const REFRESH_CACHE = '55D934C6-FC0C-4256-B19B-3B1C8CFB84F4';
const SETUP = '16374EFD-22A1-4064-9634-CC213639AD23';
const UNLOAD = 'BA51CF3C-0145-45A6-B418-41F275DCFA32';

export const autoReloadUrl = new URL(
  '../../workers/auto-reload.js',
  import.meta.url
).href;

export const swUrl = new URL('../../workers/sw.js', import.meta.url).href;

export async function removeServiceWorkers(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();

    await Promise.all(
      registrations.map((registration) => {
        return registration.unregister();
      })
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`error unregistering ServiceWorker: ${error}`);
  }
}

export async function installServiceWorker(url: string): Promise<void> {
  if (!('serviceWorker' in navigator)) return;

  try {
    if (await navigator.serviceWorker.getRegistration(url)) {
      // eslint-disable-next-line no-console
      console.debug('service worker registration already in place');

      return;
    }

    // eslint-disable-next-line no-console
    console.debug('no service worker registration found, registering');

    await removeServiceWorkers();
    await navigator.serviceWorker.register(url, {
      scope: '/',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`error registering ServiceWorker (${url}): ${error}`);
  }
}

export function refreshServiceWorker(): boolean {
  if (!('serviceWorker' in navigator)) return false;

  const { controller } = navigator.serviceWorker;
  if (!controller) return false;

  controller.postMessage(REFRESH_CACHE);
  return true;
}

export function connectWorker<T>(
  url: string,
  name: string,
  setupMessage: T | null = null
): MessagePort | null {
  const { port1, port2 } = new MessageChannel();

  if ('SharedWorker' in window) {
    try {
      const worker = new SharedWorker(url, {
        name,
      });

      const { port: managementPort } = worker;
      managementPort.start();

      addEventListener('unload', () => managementPort.postMessage(UNLOAD), {
        once: true,
        passive: true,
      });

      managementPort.postMessage(SETUP, [port2]);
      managementPort.postMessage(setupMessage);

      port1.start();

      return port1;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`error creating SharedWorker "${name}" (${url}): ${error}`);

      return null;
    }
  }

  if ('Worker' in window) {
    try {
      const worker = new Worker(url, {
        name,
      });

      worker.postMessage(SETUP, [port2]);
      worker.postMessage(setupMessage);

      port1.start();

      return port1;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        `error creating DedicatedWorker "${name}" (${url}): ${error}`
      );

      return null;
    }
  }

  return null;
}
