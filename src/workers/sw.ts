// eslint-disable-next-line spaced-comment
/// <reference lib="WebWorker" />

((scope) => {
  const ERROR_OUT_STATUS_TEXT = '25C2A7B7-8004-4180-A3D5-0C6FA51FFECA';
  const INDEX_ENDPOINT = '/index.json';

  const preCache = 'preCache';
  const swCache = 'swCache';

  const errorMessage = 'service worker synthesized response';

  const unhandledRequestUrls: RegExp[] = [
    new RegExp('^\\/api/stream'),
    new RegExp('^\\/api\\/id'),
  ];
  const denyRequestUrls: RegExp[] = [new RegExp('^\\/favicon')];
  const networkPreferredUrls: RegExp[] = [
    new RegExp('^\\/api\\/values'),
    new RegExp('^\\/id.json'),
    new RegExp('^\\/index.json'),
    new RegExp('^\\/manifest.json'),
  ];

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
      statusText: ERROR_OUT_STATUS_TEXT,
    });
  };

  const getLive = async (
    event: FetchEvent,
    task: string,
    produceErrorResponse = true
  ) => {
    return fetch(event.request)
      .then((response) => {
        if (!response.ok || response.redirected) {
          const message = [
            'error fetching live request',
            `for url "${event.request.url}"`,
            `while running task "${task}"`,
            `${response.status} ${response.statusText}`,
          ].join('\n');

          // eslint-disable-next-line no-console
          console.info(message);

          return produceErrorResponse
            ? errorOut(response.status, message)
            : null;
        }

        return response;
      })
      .catch((error) => {
        const message = [
          'error fetching live request',
          `for url "${event.request.url}"`,
          `while running task "${task}"`,
          error?.toString(),
        ].join('\n');

        // eslint-disable-next-line no-console
        console.info(message);

        return errorOut(500, message);
      });
  };

  const setCached = async (response: Response) => {
    try {
      if (!response) return response;
      if (!response.ok) return response;
      if (response.statusText === ERROR_OUT_STATUS_TEXT) return response;

      const cloned = response.clone();
      const cache = await scope.caches.open(swCache);
      await cache.put(cloned.url, cloned);

      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`setCached error: ${error}`);

      return response;
    }
  };

  const getCached = async (event: FetchEvent, task: string) => {
    try {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) return cachedResponse;

      return getLive(event, task);
    } catch (error) {
      const message = [
        'error getting cached response',
        `for url "${event.request.url}"`,
        `while running task "${task}"`,
        error?.toString(),
      ].join('\n');

      // eslint-disable-next-line no-console
      console.info(message);

      return errorOut(500, message);
    }
  };

  scope.onfetch = (fetchEvent) => {
    const { url } = fetchEvent.request;

    const unhandled = testUrl(url, unhandledRequestUrls);
    if (unhandled) return;

    fetchEvent.respondWith(
      (async () => {
        const deny = testUrl(url, denyRequestUrls);
        if (deny) {
          return errorOut(403, 'denyRequest');
        }

        const preferred = testUrl(url, networkPreferredUrls);
        if (preferred) {
          return getLive(fetchEvent, 'networkPreferred/getLive', false).then(
            (response) => {
              if (!response || response.statusText === ERROR_OUT_STATUS_TEXT) {
                return getCached(fetchEvent, 'networkPreferred/getCache');
              }

              return setCached(response);
            }
          ) as Promise<Response>;
        }

        return getCached(fetchEvent, 'cachePreferred').then(
          setCached
        ) as Promise<Response>;
      })()
    );
  };

  scope.oninstall = (installEvent) => {
    installEvent.waitUntil(
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
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`oninstall error: ${error}`);
        }
      })()
    );
  };

  scope.onactivate = (activateEvent) => {
    activateEvent.waitUntil(
      (async () => {
        try {
          await scope.clients.claim();

          await scope.caches.delete(swCache);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`onactivate error: ${error}`);
        }
      })()
    );
  };
})(self as unknown as ServiceWorkerGlobalScope);
