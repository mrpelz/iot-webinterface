import { effect } from '@preact/signals';
import { Remote, wrap } from 'comlink';
import { Workbox } from 'workbox-window';

import type { SW_API } from '../common/types.js';
import { $flags } from './util/flags.js';

export const isProd = location.hostname.endsWith('wurstsalat.cloud');

export const CHECK_INTERVAL = 15_000;

export let workbox: Workbox | undefined;
export let swProxy: Remote<SW_API> | undefined;

export const registerServiceWorker = async (): Promise<void> => {
  if (!('serviceWorker' in navigator)) return;

  try {
    workbox = new Workbox('/sw.js');
    await workbox.register();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error registering ServiceWorker', error);
  }

  swProxy = workbox ? wrap(await workbox.getSW()) : undefined;

  // eslint-disable-next-line unicorn/prefer-global-this
  if (window.__webpackServe__) return;

  effect(() => {
    const interval = setInterval(
      () => workbox?.update(),
      $flags.updateCheckInterval.value ?? CHECK_INTERVAL,
    );

    return () => clearInterval(interval);
  });
};
