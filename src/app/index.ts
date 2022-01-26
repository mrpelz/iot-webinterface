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

try {
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
  document.documentElement.removeAttribute('static');

  const deferred = async () => {
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
  };

  (() => {
    if ('requestIdleCallback' in window) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      requestIdleCallback(deferred);
      return;
    }

    if ('queueMicrotask' in window) {
      queueMicrotask(deferred);
      return;
    }

    setTimeout(deferred, 0);
  })();
} catch (error) {
  removeServiceWorkers();
  throw error;
}
