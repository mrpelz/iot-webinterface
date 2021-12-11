enum WorkerCommands {
  SETUP,
  UNLOAD,
}

export const autoReloadUrl = new URL(
  '../../workers/auto-reload.js',
  import.meta.url
).href;

export const swUrl = new URL('../../workers/sw.js', import.meta.url).href;

export const webApiUrl = new URL('../../workers/web-api.js', import.meta.url)
  .href;

export async function removeServiceWorkers(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;

  const cacheKeys = await caches.keys();
  for (const cacheKey of cacheKeys) {
    caches.delete(cacheKey);
  }

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

export async function installServiceWorker(
  url: string,
  debug: boolean
): Promise<void> {
  if (!('serviceWorker' in navigator)) return;

  const debugUrl = (() => {
    const _url = new URL(url);
    if (debug) _url.searchParams.append('debug', '1');

    return _url.href;
  })();

  try {
    const existingWorker = await navigator.serviceWorker.getRegistration(
      debugUrl
    );

    if (existingWorker?.active?.scriptURL === debugUrl) {
      if (debug) {
        // eslint-disable-next-line no-console
        console.debug('service worker registration already in place');
      }

      return;
    }

    if (debug) {
      // eslint-disable-next-line no-console
      console.debug('no service worker registration found, registering');
    }

    await removeServiceWorkers();
    await navigator.serviceWorker.register(debugUrl, {
      scope: '/',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`error registering ServiceWorker (${debugUrl}): ${error}`);
  }
}

export function refreshServiceWorker(): boolean {
  if (!('serviceWorker' in navigator)) return false;

  const { controller } = navigator.serviceWorker;
  if (!controller) return false;

  controller.postMessage(null);
  return true;
}

export function connectWorker<T>(
  url: string,
  name: string,
  setupMessage: T | null = null,
  debug: boolean
): MessagePort | null {
  const { port1, port2 } = new MessageChannel();

  const debugUrl = (() => {
    const _url = new URL(url);
    if (debug) _url.searchParams.append('debug', '1');

    return _url.href;
  })();

  if ('SharedWorker' in window) {
    try {
      const worker = new SharedWorker(debugUrl, {
        name,
      });

      const { port: managementPort } = worker;
      managementPort.start();

      addEventListener(
        'unload',
        () => managementPort.postMessage(WorkerCommands.UNLOAD),
        {
          once: true,
          passive: true,
        }
      );

      managementPort.postMessage(WorkerCommands.SETUP, [port2]);
      managementPort.postMessage(setupMessage);

      port1.start();

      return port1;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        `error creating SharedWorker "${name}" (${debugUrl}): ${error}`
      );

      return null;
    }
  }

  if ('Worker' in window) {
    try {
      const worker = new Worker(debugUrl, {
        name,
      });

      worker.postMessage(WorkerCommands.SETUP, [port2]);
      worker.postMessage(setupMessage);

      port1.start();

      return port1;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        `error creating DedicatedWorker "${name}" (${debugUrl}): ${error}`
      );

      return null;
    }
  }

  return null;
}
