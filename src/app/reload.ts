import { SharedWorkerSupported } from '@okikio/sharedworker';

import { swProxy } from './sw.js';
import { $flags } from './util/flags.js';

const RECONNECT_NOTIFIER = '3ee56e5f-2ddb-4c5e-81a1-8318e05cff72';

export const init = (): void => {
  // eslint-disable-next-line unicorn/prefer-global-this
  if (!window.__webpackServe__) return;

  const notifier = new BroadcastChannel(RECONNECT_NOTIFIER);

  if (SharedWorkerSupported) {
    // eslint-disable-next-line no-new
    new SharedWorker(
      new URL(
        '../workers/reload.js',
        import.meta.url,
      ) /* webpackChunkName: 'reload' */,
      { name: 'reload' },
    );
  } else {
    // eslint-disable-next-line no-new
    new Worker(
      new URL(
        '../workers/reload.js',
        import.meta.url,
      ) /* webpackChunkName: 'reload' */,
      { name: 'reload' },
    );
  }

  notifier.addEventListener('message', ({ data }) => {
    const data_ = JSON.parse(data);

    // eslint-disable-next-line no-console
    if ($flags.debug.value) console.debug('webpack-dev-server message', data_);

    const { type, data: hash } = data_ ?? {};

    if (type === 'hash') {
      if (hash === sessionStorage.getItem(RECONNECT_NOTIFIER)) return;

      sessionStorage.setItem(RECONNECT_NOTIFIER, hash);
      swProxy?.reload();
    }
  });
};
