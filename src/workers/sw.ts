// eslint-disable-next-line spaced-comment
/// <reference lib="WebWorker" />
// eslint-disable-next-line spaced-comment,@typescript-eslint/triple-slash-reference
/// <reference path="util/main.ts" />

const swDebug = Boolean(new URL(self.location.href).searchParams.get('debug'));

const isSafari = (() => {
  const ua = navigator.userAgent.toLowerCase();

  return ua.includes('safari') && !ua.includes('chrome');
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
  const INDEX_PATH = '/';

  const REFRESH_URL = '/DA6A9D49-D5E1-454D-BA19-DD53F5AA9935';
  const WARM_URL = '/1C941CA2-2CE3-48DB-B953-2DF891321BAF';
  const INVENTORY_URL = '/B98534B3-903F-4117-B7B7-962ABDAC4C42';
  const ECHO_URL = '/E4B38FA2-08D2-4117-9738-29FC9106CBA0';

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

  const putInCache = async (response: Response, cacheKey: string) => {
    const cloned = response.clone();
    const cache = await scope.caches.open(cacheKey);

    try {
      await cache.put(cloned.url, cloned);
    } catch {
      // noop
    }
  };

  const refreshSW = async () => {
    wsConsole.debug('refreshSW');

    try {
      await scope.clients.claim();

      if (scope.registration.active) {
        await scope.registration.update();
      }
    } catch {
      // noop
    }
  };

  const refreshCache = async (reset = false) => {
    wsConsole.debug('refreshCache');

    const indexResponse = await fetchLive(
      new URL(INDEX_ENDPOINT, scope.origin).href
    );
    if (!indexResponse) return;

    if (reset) {
      const cacheKeys = await scope.caches.keys();
      for (const cacheKey of cacheKeys) {
        // eslint-disable-next-line no-await-in-loop
        await scope.caches.delete(cacheKey);
      }
    }

    const { critical = [], optional = [] } = (await indexResponse.json()) || {};
    const paths = [INDEX_PATH].concat(critical);

    const cacheCritical = await scope.caches.open('pre_cache_critical');

    await Promise.all(
      paths.map(async (path) => {
        try {
          if (await cacheCritical.match(path)) return;
          await cacheCritical.add(path);
        } catch {
          // noop
        }
      })
    );

    if (isSafari) return;

    const cacheOptional = await scope.caches.open('pre_cache_optional');

    await Promise.all(
      (optional as string[]).map(async (path) => {
        try {
          if (await cacheOptional.match(path)) return;
          await cacheOptional.add(path);
        } catch {
          // noop
        }
      })
    );
  };

  const inventory = async () => {
    try {
      const cacheKeys = await scope.caches.keys();

      const cacheEntries = Object.fromEntries(
        await Promise.all(
          cacheKeys.map(async (cacheKey) => {
            const cache = await scope.caches.open(cacheKey);
            const responses = await cache.matchAll();

            return [
              cacheKey,
              responses.map(({ status, url }) => ({ status, url })),
            ] as const;
          })
        )
      );

      return new Response(JSON.stringify(cacheEntries, undefined, 2), {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
    } catch (error) {
      syntheticError(
        500,
        INVENTORY_URL,
        `error creating cache inventory: ${error}`
      );
    }

    return syntheticError(
      500,
      INVENTORY_URL,
      'unknown error creating cache inventory'
    );
  };

  scope.onfetch = (fetchEvent) => {
    const { request } = fetchEvent;
    const { pathname } = new URL(request.url, scope.origin);

    let pathnameOverride: string | null = null;

    const isUnhandled = testPath(pathname, unhandledRequestUrls);
    if (isUnhandled) return;

    fetchEvent.respondWith(
      // eslint-disable-next-line complexity
      (async () => {
        if (request.method === 'POST' && pathname === REFRESH_URL) {
          await refreshSW();
          await refreshCache(true);

          return new Response(REFRESH_URL);
        }

        if (request.method === 'POST' && pathname === WARM_URL) {
          await refreshCache();

          return new Response(WARM_URL);
        }

        if (request.method === 'POST' && pathname === INVENTORY_URL) {
          return inventory();
        }

        if (request.method === 'POST' && pathname === ECHO_URL) {
          return new Response(ECHO_URL);
        }

        const isDenied = testPath(pathname, denyRequestUrls);
        if (isDenied) {
          return syntheticError(403, request.url, 'denied resource');
        }

        const isIndex = testPath(pathname, indexUrl);
        if (isIndex) {
          pathnameOverride = INDEX_PATH;
        }

        const isLaxCache = testPath(pathnameOverride || pathname, laxCacheUrls);

        const cachedResponse = await scope.caches
          .match(pathnameOverride || request, { ignoreSearch: isLaxCache })
          .catch(() => undefined);

        const isLivePreferred = testPath(
          pathnameOverride || pathname,
          livePreferredUrls
        );
        if (isLivePreferred) {
          const liveResponse = await fetchLive(pathnameOverride || request);

          if (liveResponse) {
            await putInCache(liveResponse, 'post_cache_livePreferred');

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

        const liveResponse = await fetchLive(pathnameOverride || request);

        if (liveResponse) {
          await putInCache(liveResponse, 'post_cache_cachePreferred');

          return liveResponse;
        }

        if (isIndex) {
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
          await refreshCache(true);
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
