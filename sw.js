/* eslint-disable no-restricted-globals */

const version = 'v0';

const networkPreferred = [
  new RegExp('^\\/list'),
  new RegExp('^\\/values')
];

const networkOnly = [
  new RegExp('^\\/stream'),
  new RegExp('^\\/set')
];

function testUrl(url, list) {
  const {
    pathname: urlPath
  } = new URL(url);

  return list.find((listEntry) => {
    return listEntry.test(urlPath);
  });
}

function doCachingRequest(event) {
  return fetch(event.request).then((response) => {
    if (!response.ok || response.redirected) return response;

    return caches.open(version).then((cache) => {
      cache.put(event.request, response.clone());
      return response;
    });
  });
}

self.addEventListener('fetch', (event) => {
  const { url } = event.request;
  const preferred = testUrl(url, networkPreferred);
  const only = testUrl(url, networkOnly);

  if (only) return;

  event.respondWith(
    caches.match(event.request).then((cacheMatch) => {
      return (!preferred && cacheMatch) || doCachingRequest(event).catch(() => {
        return cacheMatch;
      });
    })
  );
});
