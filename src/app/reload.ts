import { sleep } from '@mrpelz/misc-utils/sleep';
import { SharedWorkerSupported } from '@okikio/sharedworker';

import { id } from './main.js';
import { workbox } from './sw.js';
import { $flags } from './util/flags.js';
import { isSafari } from './util/useragent.js';

export const RECONNECT_NOTIFIER = '3ee56e5f-2ddb-4c5e-81a1-8318e05cff72';

export let webpackServe = false;
export const webpackServeAsync = (async () => {
  while (true) {
    if (window.__webpackServe__ === undefined) {
      // eslint-disable-next-line no-await-in-loop
      await sleep(10);

      continue;
    }

    webpackServe = window.__webpackServe__;
    return webpackServe;
  }
})();

export const init = async (): Promise<void> => {
  if (!(await webpackServeAsync)) return;

  const workerName =
    SharedWorkerSupported && !isSafari ? 'reload' : `reload_${id}`;

  if (SharedWorkerSupported && !isSafari) {
    // eslint-disable-next-line no-new
    new SharedWorker(
      new URL(
        '../workers/reload.js',
        import.meta.url,
      ) /* webpackChunkName: 'reload' */,
      { name: workerName },
    );
  } else {
    // eslint-disable-next-line no-new
    new Worker(
      new URL(
        '../workers/reload.js',
        import.meta.url,
      ) /* webpackChunkName: 'reload' */,
      { name: workerName },
    );
  }

  const notifier = new BroadcastChannel(`${RECONNECT_NOTIFIER}_${workerName}`);

  notifier.addEventListener('message', async ({ data }) => {
    const data_ = JSON.parse(data);

    // eslint-disable-next-line no-console
    if ($flags.debug.value) console.debug('webpack-dev-server message', data_);

    const { type, data: hash } = data_ ?? {};

    if (type === 'hash') {
      if (hash === sessionStorage.getItem(RECONNECT_NOTIFIER)) return;

      sessionStorage.setItem(RECONNECT_NOTIFIER, hash);

      await workbox?.update();
    }
  });
};
