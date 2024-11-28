import { effect } from '@preact/signals';
import { Remote, wrap } from 'comlink';
import { Workbox } from 'workbox-window';

import type { SW_API } from '../common/types.js';
import { $flags } from './util/flags.js';

export const isProd = !['localhost', '127.0.0.1'].includes(location.hostname);
export const CHECK_INTERVAL = isProd ? 15_000 : 1000;

export let workbox: Workbox | undefined;
export let swProxy: Remote<SW_API> | undefined;

export const registerServiceWorker = async (): Promise<void> => {
  if (!('serviceWorker' in navigator)) return;

  const { updateCheckInterval } = $flags;

  workbox = new Workbox('/sw.js');
  await workbox.register();

  swProxy = wrap(await workbox.getSW());

  effect(() => {
    const interval = setInterval(
      () => workbox?.update(),
      updateCheckInterval.value ?? CHECK_INTERVAL,
    );

    return () => clearInterval(interval);
  });
};
