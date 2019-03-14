/* eslint-disable no-restricted-globals */

const version = '0.0.8';

const networkPreferred = [
  'https://hermes.net.wurstsalat.cloud/list',
  'https://hermes.net.wurstsalat.cloud/values'
];

const networkOnly = [
  'https://hermes.net.wurstsalat.cloud/stream',
  'https://hermes.net.wurstsalat.cloud/set'
];

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key === version) return Promise.resolve();
        return caches.delete(key).catch(() => {});
      }));
    })
  );
});

function testUrl(input, list) {
  return list.find((url) => {
    return input.includes(url);
  });
}

function doCachingRequest(event) {
  return fetch(event.request).then((response) => {
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
