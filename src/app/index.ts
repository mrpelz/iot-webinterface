import { iOSHoverStyles, iOSScrollToTop } from './util/ios-fixes.js';
import {
  installServiceWorker,
  removeServiceWorkers,
  swUrl,
} from './util/workers.js';
import { Notifications } from './util/notifications.js';
import { WebApi } from './web-api.js';
import { autoReload } from './util/auto-reload.js';
import { getFlags } from './util/flags.js';
import { render } from './root.js';
import { swPrerender } from './util/sw-prerender.js';

onerror = () => removeServiceWorkers();
onunhandledrejection = () => removeServiceWorkers();

const flags = getFlags();
const {
  apiBaseUrl,
  autoReloadCheckInterval,
  autoReloadUnattended,
  debug,
  enableNotifications,
  serviceWorker,
} = flags;

const webApi = new WebApi(apiBaseUrl, autoReloadCheckInterval, debug);

const notifications = new Notifications(enableNotifications);

render(flags, notifications, webApi);

const fn = async () => {
  iOSHoverStyles();
  iOSScrollToTop();

  if (serviceWorker) {
    await installServiceWorker(swUrl, debug);
  } else {
    await removeServiceWorkers();
  }

  autoReload(
    autoReloadCheckInterval,
    autoReloadUnattended,
    notifications,
    debug
  );

  await swPrerender();
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
