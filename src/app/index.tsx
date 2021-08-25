import { h, render } from 'preact';
import { iOSHoverStyles, iOSScrollToTop } from './util/ios-fixes.js';
import {
  installServiceWorker,
  removeServiceWorkers,
  swUrl,
} from './util/workers.js';
import { Root } from './root.js';
import { WebApi } from './web-api/main.js';
import { autoReload } from './util/auto-reload.js';
import { getFlags } from './util/flags.js';
import { requestNotificationPermission } from './util/notifications.js';
import { setup } from 'goober';

onerror = () => removeServiceWorkers();
onunhandledrejection = () => removeServiceWorkers();

const flags = getFlags();
const {
  serviceWorker,
  notifications,
  autoReloadInterval,
  apiBaseUrl,
  lowPriorityStream,
} = flags;

const webApi = new WebApi(apiBaseUrl, lowPriorityStream);

setup(h);
render(<Root initialFlags={flags} webApi={webApi} />, document.body);

const fn = async () => {
  iOSHoverStyles();
  iOSScrollToTop();

  if (serviceWorker) {
    await installServiceWorker(swUrl);
  } else {
    await removeServiceWorkers();
  }

  if (notifications) {
    requestNotificationPermission();
  }

  if (flags.autoReloadInterval) {
    autoReload(autoReloadInterval, notifications);
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
