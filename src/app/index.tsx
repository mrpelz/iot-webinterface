import {
  SHARED_PATH,
  getSharedWorker,
  installServiceWorker,
  removeServiceWorker,
} from './util/workers.js';
import { h, render } from 'preact';
import { iOSHoverStyles, iOSScrollToTop } from './util/iOSFixes.js';
import { App } from './app.js';
import { autoReload } from './util/autoReload.js';
import { getFlags } from './util/flags.js';
import { setup } from 'goober';

export const flags = getFlags();

(() => {
  const shared = getSharedWorker(SHARED_PATH, 'shared');
  if (!shared) return;

  shared.port.start();

  setInterval(() => {
    shared.port.postMessage('test message');
  }, 5000);
})();

(() => {
  setup(h);
  render(<App />, document.body);

  iOSHoverStyles();
  iOSScrollToTop();
})();

(() => {
  if (flags.serviceWorker) {
    installServiceWorker();
    return;
  }

  removeServiceWorker();
})();

(() => {
  if (!flags.autoReload) return;

  autoReload(flags.autoReload);
})();
