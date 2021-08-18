import { h, render } from 'preact';
import { iOSHoverStyles, iOSScrollToTop } from './util/ios-fixes.js';
import {
  installServiceWorker,
  removeServiceWorkers,
  swUrl,
} from './util/workers.js';
import { App } from './app.js';
import { autoReload } from './util/auto-reload.js';
import { getFlags } from './util/flags.js';
import { requestNotificationPermission } from './util/notifications.js';
import { setup } from 'goober';

export const flags = getFlags();

setup(h);
render(<App />, document.body);

const fn = async () => {
  iOSHoverStyles();
  iOSScrollToTop();

  if (flags.serviceWorker) {
    await installServiceWorker(swUrl);
  } else {
    await removeServiceWorkers();
  }

  if (flags.notifications) {
    requestNotificationPermission();
  }

  if (flags.autoReload) {
    autoReload(flags.autoReload);
  }
};

(() => {
  if ('requestIdleCallback' in window) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    requestIdleCallback(fn);
    return;
  }

  if ('queueMicrotask' in window) {
    queueMicrotask(fn);
    return;
  }

  setTimeout(fn, 0);
})();
