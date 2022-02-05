import { iOSHoverStyles, iOSScrollToTop } from './util/ios-fixes.js';
import {
  installServiceWorker,
  removeServiceWorkers,
  swUrl,
} from './util/workers.js';
import { Notifications } from './util/notifications.js';
import { WebApi } from './web-api.js';
import { defer } from './util/defer.js';
import { getFlags } from './util/flags.js';
import { render } from './root.js';
import { update } from './util/update.js';

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
    iOSHoverStyles();
    iOSScrollToTop();

    if (serviceWorker) {
      await installServiceWorker(swUrl, debug);
    } else {
      await removeServiceWorkers();
    }

    update(updateCheckInterval, updateUnattended, notifications, debug);
  });
} catch (error) {
  removeServiceWorkers();
  throw error;
}
