/* eslint-disable no-restricted-globals */
// eslint-disable-next-line spaced-comment
/// <reference lib="WebWorker" />

((scope) => {
  const INDEX_ENDPOINT = '/index.json';

  const preCache = 'preCache';
  const swCache = 'swCache';

  const errorMessage = 'service worker synthesized response';

  const unhandledRequestUrls: RegExp[] = [new RegExp('^\\/api/stream')];
  const denyRequestUrls: RegExp[] = [new RegExp('^\\/favicon')];
  const networkPreferredUrls: RegExp[] = [
    new RegExp('^\\/api\\/values'),
    new RegExp('^\\/id.json'),
    new RegExp('^\\/index.json'),
    new RegExp('^\\/manifest.json'),
  ];
  const networkOnlyUrls: RegExp[] = [new RegExp('^\\/api\\/id')];

  const testUrl = (url: string, list: RegExp[]) => {
    const { pathname: urlPath } = new URL(url, origin);
    return Boolean(
      list.find((listEntry) => {
        return listEntry.test(urlPath);
      })
    );
  };

  const errorOut = (status: number, msg: string) => {
    return new Response([errorMessage, status.toString(), msg].join('\n'), {
      status,
      statusText: msg,
    });
  };

  const getLive = (event: FetchEvent, msg: string, doCache = true) => {
    return fetch(event.request)
      .then((response) => {
        if (!response.ok || response.redirected) {
          return errorOut(
            response.status,
            response.ok ? msg : response.statusText
          );
        }

        const clonedResponse = response.clone();

        (async () => {
          if (!doCache) return;

          const cache = await caches.open(swCache);
          if (!cache) return;

          await cache.put(event.request, clonedResponse);
        })();

        return response;
      })
      .catch((reason) => errorOut(500, reason.toString()));
  };

  const getCache = (event: FetchEvent, msg?: string) => {
    event.respondWith(
      caches
        .match(event.request, {
          ignoreMethod: true,
          ignoreSearch: true,
          ignoreVary: true,
        })
        .then((response) => {
          if (!response) {
            return getLive(event, msg || 'cachePreferred');
          }

          return response;
        })
        .catch(() => getLive(event, msg || 'cachePreferred'))
    );
  };

  const denyRequest = (event: FetchEvent) => {
    event.respondWith(errorOut(403, 'denyRequest'));
  };

  const getNetworkOnly = (event: FetchEvent) => {
    event.respondWith(getLive(event, 'networkOnly', false));
  };

  const getNetworkPreferred = (event: FetchEvent) => {
    const msg = 'networkPreferred';

    getLive(event, msg)
      .then((response) => {
        event.respondWith(response);
      })
      .catch(() => {
        try {
          getCache(event, msg);
        } catch {
          // noop
        }
      });
  };

  scope.onfetch = (event) => {
    const { url } = event.request;

    const unhandled = testUrl(url, unhandledRequestUrls);
    if (unhandled) return;

    const deny = testUrl(url, denyRequestUrls);
    if (deny) {
      denyRequest(event);

      return;
    }

    const only = testUrl(url, networkOnlyUrls);
    if (only) {
      getNetworkOnly(event);

      return;
    }

    const preferred = testUrl(url, networkPreferredUrls);
    if (preferred) {
      getNetworkPreferred(event);

      return;
    }

    try {
      getCache(event);
    } catch {
      // noop
    }
  };

  scope.oninstall = (event) => {
    event.waitUntil(
      (async () => {
        try {
          for (const key of await scope.caches.keys()) {
            // eslint-disable-next-line no-await-in-loop
            await scope.caches.delete(key);
          }

          const response = await fetch(new URL(INDEX_ENDPOINT, origin).href);
          if (!response.ok || response.redirected) {
            return;
          }

          const cache = await scope.caches.open(preCache);

          await cache.add('/');
          await cache.addAll(await response.json());

          await scope.skipWaiting();
        } catch {
          // noop
        }
      })()
    );
  };

  scope.onactivate = (event) => {
    event.waitUntil(
      (async () => {
        try {
          await scope.caches.delete(swCache);

          await scope.clients.claim();
        } catch {
          // noop
        }
      })()
    );
  };
})(self as unknown as ServiceWorkerGlobalScope);
