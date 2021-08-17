const SETUP = '16374EFD-22A1-4064-9634-CC213639AD23';
const UNLOAD = 'BA51CF3C-0145-45A6-B418-41F275DCFA32';

export const autoReloadUrl = new URL(
  '../../workers/auto-reload.js',
  import.meta.url
).href;

export const swUrl = new URL('../../workers/sw.js', import.meta.url).href;

export function removeServiceWorkers(): void {
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

export function installServiceWorker(url: string): void {
  if (!('serviceWorker' in navigator)) return;

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

export function connectWorker(
  url: string,
  name: string,
  setupMessage?: unknown
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
