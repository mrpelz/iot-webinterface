/* eslint-disable no-restricted-globals */
// eslint-disable-next-line spaced-comment
/// <reference lib="WebWorker" />

((scope) => {
  const INDEX_ENDPOINT = '/index.json';

  const preCache = 'preCache';
  const swCache = 'swCache';

  const errorMessage = [
    '504 Gateway timeout',
    'service worker synthesized response',
    'live resource unreachable',
  ].join('\n');

  const unhandledRequestUrls: RegExp[] = [new RegExp('^\\/api/stream')];
  const denyRequestUrls: RegExp[] = [new RegExp('^\\/favicon')];
  const networkPreferredUrls: RegExp[] = [
    new RegExp('^\\/api\\/values'),
    new RegExp('^\\/id.json'),
    new RegExp('^\\/index.json'),
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

  const errorOut = (msg: string) => {
    return new Response([errorMessage, `status: ${msg}`].join('\n'), {
      status: 504,
      statusText: 'Gateway timeout',
    });
  };

  const getLive = (event: FetchEvent, msg: string, doCache = true) => {
    // eslint-disable-next-line no-console
    console.log('live', event.request.url);

    return fetch(event.request).then((response) => {
      if (!response.ok || response.redirected) {
        return errorOut(msg);
      }

      const clonedResponse = response.clone();

      (async () => {
        if (!doCache) return;

        const cache = await caches.open(swCache);
        if (!cache) return;

        await cache.put(event.request, clonedResponse);
      })();

      return response;
    });
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
    );
  };

  const denyRequest = (event: FetchEvent) => {
    event.respondWith(errorOut('denyRequest'));
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
        getCache(event, msg);
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

    getCache(event);
  };

  scope.oninstall = (event) => {
    event.waitUntil(
      (async () => {
        try {
          for (const key of await caches.keys()) {
            caches.delete(key);
          }
        } catch {
          // noop
        }

        const response = await fetch(new URL(INDEX_ENDPOINT, origin).href);
        if (!response.ok || response.redirected) {
          return;
        }

        const cache = await caches.open(preCache);

        await cache.add('/');
        await cache.addAll(await response.json());

        await scope.skipWaiting();
      })()
    );
  };

  scope.onactivate = (event) => {
    event.waitUntil(scope.clients.claim());
  };
})(self as unknown as ServiceWorkerGlobalScope);
