/* eslint-disable no-restricted-globals */
// eslint-disable-next-line spaced-comment
/// <reference lib="WebWorker" />

const version = 'v0';

declare const self: ServiceWorkerGlobalScope;

const networkPreferred = [new RegExp('^\\/list'), new RegExp('^\\/values')];
const networkOnly = [new RegExp('^\\/stream'), new RegExp('^\\/set')];

function testUrl(url: string, list: RegExp[]) {
  const { pathname: urlPath } = new URL(url);

  return list.find((listEntry) => {
    return listEntry.test(urlPath);
  });
}

async function liveRequest(request: Request) {
  const response = await fetch(request);
  if (!response.ok || response.redirected) return response;

  const cache = await caches.open(version);
  if (!cache) return response;

  cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', async ({ respondWith, request }) => {
  const { url } = request;
  const preferred = testUrl(url, networkPreferred);

  const only = testUrl(url, networkOnly);
  if (only) return;

  const cacheHit = await caches.match(request);
  const liveResponse = preferred ? await liveRequest(request) : null;

  if (liveResponse) {
    respondWith(liveResponse);
    return;
  }

  if (cacheHit) {
    respondWith(cacheHit);
  }
});

export default null;
