enum WorkerCommands {
  SETUP,
  UNLOAD,
  PING,
}

export const swUrl = new URL('../../workers/sw.js', import.meta.url).href;

export const updateUrl = new URL('../../workers/update.js', import.meta.url)
  .href;

export const webApiUrl = new URL('../../workers/web-api.js', import.meta.url)
  .href;

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
      registrations.map((registration) => {
        return registration.unregister();
      })
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`error unregistering ServiceWorker: ${error}`);
  }
};

export const installServiceWorker = async (
  url: string,
  debug: boolean
): Promise<void> => {
  if (!('serviceWorker' in navigator)) return;

  const aUrl = (() => {
    const _url = new URL(url);
    if (debug) _url.searchParams.append('debug', '1');

    return _url.href;
  })();

  try {
    const existingServiceWorkers =
      await navigator.serviceWorker.getRegistrations();

    const existingMatch = existingServiceWorkers.find(
      (serviceWorker) => serviceWorker.active?.scriptURL === aUrl
    );

    const otherServiceWorkers = existingMatch
      ? existingServiceWorkers.filter(
          (serviceWorker) => serviceWorker !== existingMatch
        )
      : existingServiceWorkers;

    for (const serviceWorker of otherServiceWorkers) {
      if (debug) {
        // eslint-disable-next-line no-console
        console.debug(
          `removing stale service worker "${
            serviceWorker.active?.scriptURL ||
            serviceWorker.installing?.scriptURL ||
            serviceWorker.waiting?.scriptURL
          }"`
        );
      }

      serviceWorker.unregister();
    }

    if (existingMatch) return;

    if (debug) {
      // eslint-disable-next-line no-console
      console.debug(`registering service worker "${aUrl}"`);
    }

    await navigator.serviceWorker.register(aUrl, {
      scope: '/',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`error registering ServiceWorker (${aUrl}): ${error}`);
  }
};

const keepAlive = (port: MessagePort | Worker) => {
  let timer: number | null = null;

  port.onmessage = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  setInterval(() => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => location.reload(), 1000);

    port.postMessage(WorkerCommands.PING);
  }, 5000);
};

export const connectWorker = <T>(
  url: string,
  name: string,
  setupMessage: T | null = null,
  debug: boolean
): MessagePort | null => {
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

      keepAlive(managementPort);

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

      keepAlive(worker);

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
};
