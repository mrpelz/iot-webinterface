// eslint-disable-next-line spaced-comment
/// <reference lib="WebWorker" />
// eslint-disable-next-line spaced-comment,@typescript-eslint/triple-slash-reference
/// <reference path="utils/main.ts" />

((scope) => {
  importScripts('./utils/main.js');

  /* eslint-disable no-console */
  const wsConsole = {
    debug: (...args: unknown[]) => console.debug('service worker:', ...args),
    error: (...args: unknown[]) => console.error('service worker:', ...args),
    info: (...args: unknown[]) => console.info('service worker:', ...args),
  };
  /* eslint-enable no-console */

  const ERROR_OUT_STATUS_TEXT = '25C2A7B7-8004-4180-A3D5-0C6FA51FFECA';

  const INDEX_ENDPOINT = '/index.json';

  const PRE_CACHE = 'preCache';
  const SW_CACHE = 'swCache';

  const errorMessage = 'service worker synthesized response';

  const unhandledRequestUrls: RegExp[] = [
    new RegExp('^\\/api\\/id'),
    new RegExp('^\\/api\\/stream'),
    new RegExp('^\\/id.txt'),
  ];
  const denyRequestUrls: RegExp[] = [new RegExp('^\\/favicon')];
  const networkPreferredUrls: RegExp[] = [
    new RegExp('^\\/api\\/values'),
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
    return new Response(
      multiline`
        Status: ${status.toString()}
        ${errorMessage}

        <msg>
        ${msg}
        </msg>
      `,
      {
        status,
        statusText: ERROR_OUT_STATUS_TEXT,
      }
    );
  };

  const getLive = async (
    event: FetchEvent,
    task: string,
    produceErrorResponse = true
  ) => {
    return fetch(event.request)
      .then(async (response) => {
        if (!response.ok || response.redirected) {
          const message = multiline`
            error fetching live request
            * for url "${event.request.url}"
            * while running task "${task}"
            
            <response-text>
            ${await response.text()}
            </response-text>
          `;

          wsConsole.info(message);

          return produceErrorResponse
            ? errorOut(response.status, message)
            : null;
        }

        return response;
      })
      .catch((error) => {
        const message = multiline`
          error fetching live request
          * for url "${event.request.url}"
          * while running task "${task}"
          
          <error>
          ${error?.toString()}
          </error>
        `;

        wsConsole.info(message);

        return errorOut(500, message);
      });
  };

  const setCached = async (response: Response) => {
    try {
      if (!response) return response;
      if (!response.ok) return response;
      if (response.statusText === ERROR_OUT_STATUS_TEXT) return response;

      const cloned = response.clone();
      const cache = await scope.caches.open(SW_CACHE);
      await cache.put(cloned.url, cloned);

      return response;
    } catch (error) {
      wsConsole.error(`setCached error: ${error}`);

      return response;
    }
  };

  const getCached = async (event: FetchEvent, task: string) => {
    try {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) return cachedResponse;

      return getLive(event, task);
    } catch (error) {
      const message = multiline`
        error getting cached response
        * for url "${event.request.url}"
        * while running task "${task}"
        
        <error>
        ${error?.toString()}
        </error>
      `;

      wsConsole.info(message);

      return errorOut(500, message);
    }
  };

  const refreshCache = async () => {
    wsConsole.debug('refreshCache');

    for (const key of await scope.caches.keys()) {
      // eslint-disable-next-line no-await-in-loop
      await scope.caches.delete(key);
    }

    const response = await fetch(new URL(INDEX_ENDPOINT, origin).href);
    if (!response.ok || response.redirected) {
      return;
    }

    const cache = await scope.caches.open(PRE_CACHE);

    await cache.add('/');
    await cache.addAll(await response.json());

    await scope.caches.delete(SW_CACHE);
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
    wsConsole.debug('oninstall');

    installEvent.waitUntil(scope.skipWaiting());
  };

  scope.onactivate = (activateEvent) => {
    wsConsole.debug('onactivate');

    activateEvent.waitUntil(
      (async () => {
        try {
          await refreshCache();
          await scope.clients.claim();
        } catch (error) {
          wsConsole.error(`onactivate error: ${error}`);
        }
      })()
    );
  };

  scope.onmessage = () => {
    wsConsole.debug('received refreshRequest from client');

    (async () => {
      try {
        await refreshCache();
      } catch (error) {
        wsConsole.error(`onmessage error: ${error}`);
      }
    })();
  };
})(self as unknown as ServiceWorkerGlobalScope);
