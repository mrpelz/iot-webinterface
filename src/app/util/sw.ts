import { Remote, wrap } from 'comlink';
import { Workbox } from 'workbox-window';

import type { API } from '../../common/types.js';

export const isProd = !['localhost', '127.0.0.1'].includes(location.hostname);
export const CHECK_INTERVAL = isProd ? 15_000 : 1000;

export let workbox: Workbox | undefined;
export let swProxy: Remote<API> | undefined;

export const registerServiceWorker = async (
  updateCheckInterval?: number,
): Promise<void> => {
  if (!('serviceWorker' in navigator)) return;

  workbox = new Workbox('/sw.js');
  await workbox.register();

  swProxy = wrap(await workbox.getSW());

  setInterval(() => workbox?.update(), updateCheckInterval ?? CHECK_INTERVAL);
};
