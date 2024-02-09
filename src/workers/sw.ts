import { precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST, {
  urlManipulation: ({ url }) => {
    const { pathname } = url;
    const pathChunks = pathname.slice(1).split('/');

    if (pathChunks[0] !== 'api' && !pathname.includes('.')) {
      url.pathname = '/index.html';
    }

    return [url];
  },
});
