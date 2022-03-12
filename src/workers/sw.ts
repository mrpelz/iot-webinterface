// eslint-disable-next-line spaced-comment
/// <reference lib="WebWorker" />
// eslint-disable-next-line spaced-comment,@typescript-eslint/triple-slash-reference
/// <reference path="util/main.ts" />

const swDebug = Boolean(new URL(self.location.href).searchParams.get('debug'));

const isSafari = (() => {
  const ua = navigator.userAgent.toLowerCase();

  if (!ua.includes('chrome')) return false;
  if (!ua.includes('safari')) return false;

  return true;
})();

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

  const ERROR_MESSAGE = 'service worker synthesized response';
  const FALLBACK_HTML = `
    <!DOCTYPE html>
    <html lang="en" style="background-color: #000000; color: #FFFFFF; padding-top: env(safe-area-inset-top);">
    <head>
      <meta charset="utf-8" />
      <title>Offline…</title>
      <meta name="viewport" content="viewport-fit=cover, width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
    </head>
    <body>
      <button onclick="location.reload();">reload</button>
    </body>
    </html>
  `;

  const laxCacheUrls: RegExp[] = [new RegExp('^/$')];

  const unhandledRequestUrls: RegExp[] = [
    new RegExp('^/api(?!/hierarchy|/id)$'),
    new RegExp('^/id.txt$'),
  ];
  const denyRequestUrls: RegExp[] = [new RegExp('^/favicon')];
  const indexUrl: RegExp[] = [
    new RegExp('^/index.html$'),
    new RegExp('^/(?:(?!api|\\.).)*$'),
  ];
  const livePreferredUrls: RegExp[] = [
    new RegExp('^/api/id$'),
    new RegExp('^/index.json$'),
    new RegExp('^/manifest.json$'),
  ];

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
        ${ERROR_MESSAGE}

        <label>
          ${label}
        </label>

        <msg>
          ${message}
        </msg>
      `,
      {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': 'text/plain; charset=utf-8',
        },
        status,
      }
    );

    return response;
  };

  const fetchLive = (request: RequestInfo) => fetchFallback(request, 2000);

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

    await scope.clients.claim();

    try {
      if (scope.registration.active) {
        await scope.registration.update();
      }
    } catch {
      // noop
    }

    const response = await fetchLive(
      new URL(INDEX_ENDPOINT, scope.origin).href
    );
    if (!response) return;

    const cacheKeys = await caches.keys();
    for (const cacheKey of cacheKeys) {
      // eslint-disable-next-line no-await-in-loop
      await caches.delete(cacheKey);
    }

    const cache = await scope.caches.open(CACHE_KEY);

    const { critical = [], optional = [] } = (await response.json()) || {};
    const paths = ['/'].concat(critical);

    await Promise.all(
      paths.map(async (path) => {
        try {
          await cache.add(path);
        } catch {
          // noop
        }
      })
    );

    if (isSafari) return;

    await Promise.all(
      (optional as string[]).map(async (path) => {
        try {
          await cache.add(path);
        } catch {
          // noop
        }
      })
    );
  };

  scope.onfetch = (fetchEvent) => {
    const { request } = fetchEvent;
    let { pathname } = new URL(request.url, scope.origin);

    const isUnhandled = testPath(pathname, unhandledRequestUrls);
    if (isUnhandled) return;

    fetchEvent.respondWith(
      (async () => {
        if (request.method === 'POST' && pathname === REFRESH_URL) {
          await refreshCache();

          return new Response(REFRESH_URL);
        }

        const isDenied = testPath(pathname, denyRequestUrls);
        if (isDenied) {
          return syntheticError(403, request.url, 'denied resource');
        }

        const isIndex = testPath(pathname, indexUrl);
        if (isIndex) {
          pathname = '/';
        }

        const isLaxCache = testPath(pathname, laxCacheUrls);

        const cachedResponse = await caches
          .match(pathname, { ignoreSearch: isLaxCache })
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
            request.url,
            'live-preferred resource not available from live or from cache'
          );
        }

        if (cachedResponse) return cachedResponse;

        const liveResponse = await fetchLive(request);

        if (liveResponse) {
          await putInCache(liveResponse);

          return liveResponse;
        }

        if (pathname === '/') {
          return new Response(FALLBACK_HTML, {
            headers: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'Content-Type': 'text/html; charset=utf-8',
            },
            status: 500,
          });
        }

        return syntheticError(
          500,
          request.url,
          'cache-preferred resource not available from cache or from live'
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
