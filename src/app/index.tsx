import {
  SHARED_PATH,
  SW_PATH,
  getSharedWorker,
  installServiceWorker,
  removeServiceWorkers,
} from './util/workers.js';
import { h, render } from 'preact';
import { iOSHoverStyles, iOSScrollToTop } from './util/iOSFixes.js';
import { App } from './app.js';
import { autoReload } from './util/autoReload.js';
import { getFlags } from './util/flags.js';
import { setup } from 'goober';

export const flags = getFlags();
export const shared = getSharedWorker(SHARED_PATH, 'shared');

setup(h);
render(<App />, document.body);

iOSHoverStyles();
iOSScrollToTop();

if (flags.serviceWorker) {
  installServiceWorker(SW_PATH);
} else {
  removeServiceWorkers();
}

if (flags.autoReload) {
  autoReload(flags.autoReload);
}
