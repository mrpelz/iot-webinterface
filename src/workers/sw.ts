// eslint-disable-next-line spaced-comment
/// <reference lib="WebWorker" />
// eslint-disable-next-line spaced-comment,@typescript-eslint/triple-slash-reference
/// <reference path="util/main.ts" />

const swDebug = Boolean(new URL(self.location.href).searchParams.get('debug'));

((scope) => {
  importScripts('./util/main.js');

  /* eslint-disable no-console */
  const wsConsole = {
    debug: (...args: unknown[]) => {
      if (!swDebug) return;
      console.debug('service worker:', ...args);
    },
    error: (...args: unknown[]) => {
      console.error('service worker:', ...args);
    },
    info: (...args: unknown[]) => {
      if (!swDebug) return;
      console.info('service worker:', ...args);
    },
  };
  /* eslint-enable no-console */

  const INDEX_ENDPOINT = '/index.json';
  const CACHE_KEY = 'cache';

  const REFRESH_URL = '/DA6A9D49-D5E1-454D-BA19-DD53F5AA9935';
  const BACKFILL_URL = '/35BF75F5-4827-4F54-912B-002082F8615F';

  const errorMessage = 'service worker synthesized response';

  const laxCacheUrls: RegExp[] = [new RegExp('^\\/$')];

  const unhandledRequestUrls: RegExp[] = [
    new RegExp('^\\/api(?!\\/hierarchy|\\/id)$'),
    new RegExp('^\\/id.txt$'),
  ];
  const denyRequestUrls: RegExp[] = [new RegExp('^\\/favicon')];
  const livePreferredUrls: RegExp[] = [
    new RegExp('^\\/api\\/id$'),
    new RegExp('^\\/index.json$'),
    new RegExp('^\\/manifest.json$'),
  ];
  const cachePreferredUrls: RegExp[] = [new RegExp('^\\/api\\/hierarchy$')];

  const testPath = (path: string, list: RegExp[]) => {
    for (const regex of list) {
      if (regex.test(path)) return true;
    }

    return false;
  };

  const syntheticError = (status: number, label: string, message: string) => {
    const response = new Response(
      multiline`
        Status: ${status.toString()}
        ${errorMessage}

        <label>
          ${label}
        </label>

        <msg>
          ${message}
        </msg>
      `,
      { status }
    );

    return response;
  };

  const fetchLive = (request: RequestInfo) => {
    return fetch(request, {
      credentials: 'include',
      redirect: 'follow',
    })
      .then((response) => (response.ok ? response : undefined))
      .catch(() => undefined);
  };

  const putInCache = async (response: Response) => {
    const cloned = response.clone();
    const cache = await scope.caches.open(CACHE_KEY);

    try {
      await cache.put(cloned.url, cloned);
    } catch {
      // noop
    }
  };

  const refreshCache = async () => {
    wsConsole.debug('refreshCache');

    await scope.caches.delete(CACHE_KEY);
    await scope.caches.delete(CACHE_KEY);
    await scope.caches.delete(CACHE_KEY);
    await scope.caches.delete(CACHE_KEY);
    await scope.caches.delete(CACHE_KEY);

    const response = await fetchLive(
      new URL(INDEX_ENDPOINT, scope.origin).href
    );
    if (!response) return;

    const paths = ['/'].concat((await response.json()) || []);

    const cache = await scope.caches.open(CACHE_KEY);

    for (const path of paths) {
      /* eslint-disable no-await-in-loop */
      try {
        await cache.add(path);
      } catch {
        // noop
      }
      /* eslint-enable no-await-in-loop */
    }
  };

  const backfillCache = async () => {
    wsConsole.debug('backfillCache');

    const response = await fetchLive(
      new URL(INDEX_ENDPOINT, scope.origin).href
    );
    if (!response) return;

    const paths = ['/'].concat((await response.json()) || []);

    const cache = await scope.caches.open(CACHE_KEY);

    for (const path of paths) {
      /* eslint-disable no-await-in-loop */
      try {
        const match = await cache.match(path);
        if (match) continue;

        await cache.add(path);
      } catch {
        // noop
      }
      /* eslint-enable no-await-in-loop */
    }
  };

  scope.onfetch = (fetchEvent) => {
    const { request } = fetchEvent;
    const { pathname } = new URL(request.url, scope.origin);

    const isUnhandled = testPath(pathname, unhandledRequestUrls);
    if (isUnhandled) return;

    fetchEvent.respondWith(
      (async () => {
        if (pathname === REFRESH_URL) {
          await scope.registration.update();
          await refreshCache();

          return new Response(undefined, { status: 204 });
        }

        if (pathname === BACKFILL_URL) {
          await backfillCache();

          return new Response(undefined, { status: 204 });
        }

        const isDenied = testPath(pathname, denyRequestUrls);
        if (isDenied) {
          return syntheticError(403, 'denied', 'denied resource');
        }

        const isLaxCache = testPath(pathname, laxCacheUrls);

        const cachedResponse = await caches
          .match(request, { ignoreSearch: isLaxCache })
          .catch(() => undefined);

        const isLivePreferred = testPath(pathname, livePreferredUrls);
        if (isLivePreferred) {
          const liveResponse = await fetchLive(request);

          if (liveResponse) {
            await putInCache(liveResponse);

            return liveResponse;
          }

          if (cachedResponse) return cachedResponse;

          return syntheticError(
            500,
            'livePreferred',
            'live-preferred resource not available from live or from cache'
          );
        }

        const isCachePreferred = testPath(pathname, cachePreferredUrls);
        if (isCachePreferred) {
          if (cachedResponse) return cachedResponse;

          const liveResponse = await fetchLive(request);

          if (liveResponse) {
            await putInCache(liveResponse);

            return liveResponse;
          }

          return syntheticError(
            500,
            'cachePreferred',
            'cache-preferred resource not available from cache or from live'
          );
        }

        if (cachedResponse) return cachedResponse;

        const liveResponse = await fetchLive(request);
        if (liveResponse) return liveResponse;

        return syntheticError(
          500,
          'cacheOnly',
          'cache-only resource not found in cache and not fetchable from live'
        );
      })()
    );
  };

  scope.oninstall = (installEvent) => {
    wsConsole.debug('oninstall');

    installEvent.waitUntil(
      (async () => {
        try {
          await refreshCache();
          await scope.skipWaiting();
        } catch (error) {
          wsConsole.error(`oninstall error: ${error}`);
        }
      })()
    );
  };

  scope.onactivate = (activateEvent) => {
    wsConsole.debug('onactivate');

    activateEvent.waitUntil(
      (async () => {
        try {
          await scope.clients.claim();
        } catch (error) {
          wsConsole.error(`onactivate error: ${error}`);
        }
      })()
    );
  };
})(self as unknown as ServiceWorkerGlobalScope);
