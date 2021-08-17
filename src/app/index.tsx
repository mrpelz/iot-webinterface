import { h, render } from 'preact';
import { iOSHoverStyles, iOSScrollToTop } from './util/iOSFixes.js';
import {
  installServiceWorker,
  removeServiceWorkers,
  swUrl,
} from './util/workers.js';
import { App } from './app.js';
import { autoReload } from './util/auto-reload.js';
import { getFlags } from './util/flags.js';
import { setup } from 'goober';

export const flags = getFlags();

setup(h);
render(<App />, document.body);

iOSHoverStyles();
iOSScrollToTop();

if (flags.serviceWorker) {
  installServiceWorker(swUrl);
} else {
  removeServiceWorkers();
}

if (flags.autoReload) {
  autoReload(flags.autoReload);
}
