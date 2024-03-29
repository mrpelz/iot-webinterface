import { iOSHoverStyles, iOSScrollToTop } from './util/ios-fixes.js';
import {
  installServiceWorker,
  removeServiceWorkers,
  swUrl,
} from './util/workers.js';
import { update, warm } from './util/update.js';
import { Notifications } from './util/notifications.js';
import { WebApi } from './web-api.js';
import { defer } from './util/defer.js';
import { getFlags } from './util/flags.js';
import { multiline } from './util/string.js';
import { persist } from './util/storage.js';
import { render } from './root.js';

try {
  const flags = getFlags();
  const {
    apiBaseUrl,
    debug,
    enableNotifications,
    serviceWorker,
    updateCheckInterval,
    updateUnattended,
  } = flags;

  const webApi = new WebApi(apiBaseUrl, updateCheckInterval, debug);

  const notifications = new Notifications(enableNotifications);

  render(flags, notifications, webApi);
  document.documentElement.removeAttribute('static');

  defer(async () => {
    if (serviceWorker) {
      await installServiceWorker(swUrl, debug);
    } else {
      await removeServiceWorkers();
    }

    update(
      updateCheckInterval,
      updateUnattended,
      notifications,
      serviceWorker,
      debug
    );

    iOSHoverStyles();
    iOSScrollToTop();

    warm();

    persist();
  });
} catch (error) {
  if (
    // eslint-disable-next-line no-alert
    confirm(multiline`
    Error!

    Confirm to clear local storage and remove ServiceWorker.

    ${(error as Error).name}: "${(error as Error).message}"
    
    ${(error as Error).stack || '[no stack trace]'}
    `)
  ) {
    localStorage.clear();
    removeServiceWorkers();
  }

  throw error;
}
