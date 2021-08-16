const PROXY_SETUP = '16374EFD-22A1-4064-9634-CC213639AD23' as const;
const UNLOAD = 'BA51CF3C-0145-45A6-B418-41F275DCFA32' as const;

type WorkerMessage =
  | {
      command: typeof PROXY_SETUP;
      initValue?: unknown;
      name: string;
      url: string;
    }
  | {
      command: typeof UNLOAD;
    };

export const AUTO_RELOAD_PATH = '../../workers/autoReload.js';
export const SHARED_PATH = '../../workers/shared.js';
export const SW_PATH = '../../workers/sw.js';

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

export function installServiceWorker(path: string): void {
  if (!('serviceWorker' in navigator)) return;

  const url = new URL(path, import.meta.url).href;

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
): MessagePort | null {
  if (!('SharedWorker' in window)) return null;

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
    const { port } = worker;

    port.start();

    const unloadMessage: WorkerMessage = {
      command: UNLOAD,
    };

    addEventListener('unload', () => port.postMessage(unloadMessage), {
      once: true,
      passive: true,
    });

    return port;
  }

  return null;
}

export function getWorker(
  path: string,
  name: string,
  sharedPort: MessagePort | null = null,
  initValue?: unknown
): MessagePort | null {
  if (!('Worker' in window)) return null;

  const url = new URL(path, import.meta.url).href;

  const { port1, port2 } = new MessageChannel();

  if (sharedPort) {
    const proxySetupMessage: WorkerMessage = {
      command: PROXY_SETUP,
      initValue,
      name,
      url,
    };

    sharedPort.postMessage(proxySetupMessage, [port2]);

    port1.start();

    return port1;
  }

  const worker = (() => {
    try {
      return new Worker(url, {
        name,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`error getting Worker "${name}" (${url}): ${error}`);

      return null;
    }
  })();

  if (worker) {
    worker.postMessage(initValue, [port2]);

    port1.start();

    return port1;
  }

  return null;
}
