export async function swPrerender(): Promise<void> {
  if (!('serviceWorker' in navigator) || !('caches' in window)) return;

  if (
    navigator.userAgent.includes('iPad') ||
    navigator.userAgent.includes('iPhone') ||
    navigator.userAgent.includes('iPod')
  ) {
    return;
  }

  try {
    const cache = await caches.open('a_ssr');

    addEventListener('beforeunload', async () => {
      await cache.put(
        '/',
        new Response(
          ['<!DOCTYPE html>', document.documentElement.outerHTML].join('\n'),
          {
            headers: {
              /* eslint-disable @typescript-eslint/naming-convention */
              'Cache-Control': 'no-store, no-cache',
              'Content-Type': 'text/html; charset=utf-8',
              Server: 'sw-cache',
              'Service-Worker-Allowed': '/',
              /* eslint-enablle @typescript-eslint/naming-convention */
            },
            status: 200,
            statusText: 'OK',
          }
        )
      );
    });
  } catch {
    // noop
  }
}
