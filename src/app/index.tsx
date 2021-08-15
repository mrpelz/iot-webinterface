import {
  SHARED_PATH,
  getSharedWorker,
  installServiceWorker,
  removeServiceWorker,
} from './util/workers.js';
import { h, render } from 'preact';
import { App } from './app.js';
import { autoReload } from './util/autoReload.js';
import { getFlags } from './util/flags.js';
import { iOSScrollToTop } from './util/iOSScrollToTop.js';
import { setup } from 'goober';

export const flags = getFlags();

setup(h);
render(<App />, document.body);

iOSScrollToTop();

(() => {
  if (flags.serviceWorker) {
    installServiceWorker();
    return;
  }

  removeServiceWorker();
})();

const shared = getSharedWorker(SHARED_PATH, 'shared');
if (shared) {
  shared.port.start();

  setInterval(() => {
    shared.port.postMessage('test message');
  }, 5000);
}

autoReload();
