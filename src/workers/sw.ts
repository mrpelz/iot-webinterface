import { fetchFallback, sleep } from './util/main.js';

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace NgxAutoIndex {
  type Item = {
    mtime?: string;
    name: string;
    type: string;
  };

  type Directory = Item & {
    type: 'directory';
  };

  type File = Item & {
    size?: number;
    type: 'file';
  };
}

const REFRESH_URL = '/DA6A9D49-D5E1-454D-BA19-DD53F5AA9935';

const INDEX = '/';
const CACHE_KEY_PRE = 'pre';
const CACHE_KEY_DYNAMIC = 'dynamic';

const DELAY_MS_CACHE_REVALIDATE = 2000;
const DELAY_CLIENT_RELOAD = 10_000;

const notificationTagPreCache = `${self.serviceWorker.scriptURL}:preCache`;

let isUpdateFromRefreshUrl = false;
let isUpdatingCache = false;

const deleteNotification = async (tag: string) => {
  for (const notification of await self.registration.getNotifications({
    tag,
  })) {
    notification.close();
  }
};

const showNotification = (title: string, options?: NotificationOptions) => {
  if (!('Notification' in self)) return;
  if (self.Notification.permission !== 'granted') return;
  if (!self.registration.active) return;

  self.registration.showNotification(title, options);
};

const isNgxAutoIndexItem = (input: unknown): input is NgxAutoIndex.Item => {
  if (!input) return false;
  if (typeof input !== 'object') return false;

  if (!('type' in input)) return false;

  if ('mtime' in input && typeof input.mtime !== 'string') return false;

  if (!('name' in input)) return false;
  if (typeof input.name !== 'string') return false;

  return true;
};

const isNgxAutoIndexDirectory = (
  input: NgxAutoIndex.Item,
): input is NgxAutoIndex.Directory => {
  if (input.type !== 'directory') return false;

  return true;
};

const isNgxAutoIndexFile = (
  input: NgxAutoIndex.Item,
): input is NgxAutoIndex.File => {
  if (input.type !== 'file') return false;

  if ('size' in input && typeof input.size !== 'number') return false;

  return true;
};

const preCacheDirectory = async (
  cache: Cache,
  promises: Promise<unknown>[],
  entry_: string[] = [],
) => {
  const entry = entry_.length > 0 ? `/${entry_.join('/')}/` : '/';

  showNotification('Pre-Caching', {
    body: `handling "${entry}"`,
    tag: notificationTagPreCache,
  });

  const entryRequest = await fetch(entry, {
    headers: { accept: 'application/json' },
  }).catch(() => undefined);

  if (!entryRequest) return;

  const list = await entryRequest.json().catch(() => undefined);
  if (!list || !Array.isArray(list)) return;

  for (const item of list) {
    if (!isNgxAutoIndexItem(item)) continue;

    const itemPath = [...entry_, item.name].filter((path) => path.length > 0);

    if (isNgxAutoIndexDirectory(item)) {
      // eslint-disable-next-line no-await-in-loop
      await preCacheDirectory(cache, promises, itemPath);

      continue;
    }

    if (isNgxAutoIndexFile(item)) {
      promises.push(cache.add(`/${itemPath.join('/')}`));
    }
  }
};

const preCacheRefresh = async () => {
  if (isUpdatingCache) return;
  isUpdatingCache = true;

  await caches.delete(CACHE_KEY_PRE);
  const cache = await caches.open(CACHE_KEY_PRE);

  const promises: Promise<unknown>[] = [cache.add(INDEX)];

  await preCacheDirectory(cache, promises);

  await Promise.all(promises);
  await deleteNotification(notificationTagPreCache);

  // eslint-disable-next-line require-atomic-updates
  isUpdatingCache = false;
};

const cleanResponse = async (response: Response) => {
  const { body, headers, status, statusText } = response;

  return new Response(body ?? (await response.blob()), {
    headers,
    status,
    statusText,
  });
};

const fetchWithCache = async (
  input: URL | RequestInfo,
  waitToCache?: Promise<unknown>,
) => {
  const url = new URL(input instanceof Request ? input.url : input.toString());
  url.hash = '';

  const cache = await caches.open(CACHE_KEY_DYNAMIC);
  const cachedResponse = await caches.match(url);

  const doFetch = async () => {
    const [response] = await fetchFallback(input);
    if (!response) return undefined;

    return response.redirected ? cleanResponse(response) : response;
  };

  const networkResponsePromise = cachedResponse
    ? sleep(DELAY_MS_CACHE_REVALIDATE).then(() => doFetch())
    : doFetch();

  const deferredCaching = (async () => {
    const networkResponse = await networkResponsePromise.catch(() => undefined);
    if (!networkResponse) return;

    const clonedResponse = networkResponse.clone();

    if (!clonedResponse.ok) return;

    if (
      clonedResponse.headers.get('x-original-pathname') === INDEX &&
      clonedResponse.url !== INDEX
    ) {
      return;
    }

    if (waitToCache) await waitToCache;

    await cache.put(url, clonedResponse);
  })();

  return {
    deferredCaching,
    response: cachedResponse ?? networkResponsePromise,
  };
};

const refreshClients = async (reloadDelay: number) => {
  await self.clients.claim();

  const clients = await self.clients.matchAll({
    includeUncontrolled: true,
    type: 'window',
  });

  for (const client of clients) {
    client.postMessage(reloadDelay);
  }
};

self.addEventListener('install', async (event) => {
  const { type } = event;

  const tag = `${self.serviceWorker.scriptURL}:${type}`;

  showNotification('Installing ServiceWorker', {
    body: 'filling pre-cache',
    tag,
  });

  self.skipWaiting();

  event.waitUntil(
    (async (): Promise<void> => {
      await preCacheRefresh();
      await deleteNotification(tag);
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await caches.delete(CACHE_KEY_DYNAMIC);

      if (isUpdateFromRefreshUrl) return;

      await deleteNotification('reload');
      await refreshClients(DELAY_CLIENT_RELOAD);
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const {
    handled,
    request,
    request: { url: url_ },
  } = event;

  if (request.headers.get('x-sw-skip') === '1') return;

  const url = new URL(url_);

  event.respondWith(
    (async () => {
      if (url.pathname === REFRESH_URL) {
        isUpdateFromRefreshUrl = true;

        event.waitUntil(
          (async () => {
            await self.registration.update();

            await preCacheRefresh();
            await caches.delete(CACHE_KEY_DYNAMIC);

            const delay = url.searchParams.get('delay');

            await refreshClients(
              (delay ? Number.parseInt(delay, 10) : null) ??
                DELAY_CLIENT_RELOAD,
            );

            isUpdateFromRefreshUrl = false;
          })(),
        );

        return new Response(REFRESH_URL);
      }

      const { deferredCaching, response } = await fetchWithCache(
        request,
        handled,
      );

      event.waitUntil(deferredCaching);

      return Promise.resolve(response).then((result) => {
        if (result) return result;

        url.hash = new URLSearchParams({
          path: JSON.stringify(url.pathname),
        }).toString();
        url.pathname = '';

        return new Response(undefined, {
          headers: {
            location: url.href,
          },
          status: 307,
        });
      });
    })(),
  );
});
