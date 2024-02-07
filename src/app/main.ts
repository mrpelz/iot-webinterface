import { stripIndent } from 'proper-tags';

import { render } from './root.js';
import { defer } from './util/defer.js';
import { getFlags } from './util/flags.js';
import { iOSHoverStyles, iOSScrollToTop } from './util/ios-fixes.js';
import { requestNotificationPermission } from './util/notifications.js';
import { registerServiceWorker } from './util/service-worker.js';
import { persist } from './util/storage.js';
import { update } from './util/update.js';
import { WebApi } from './web-api.js';

try {
  const flags = getFlags();
  const { apiBaseUrl, debug, updateCheckInterval } = flags;

  const webApi = new WebApi(apiBaseUrl, debug);

  render(flags, webApi);
  document.documentElement.removeAttribute('static');

  defer(async () => {
    registerServiceWorker();

    update(updateCheckInterval, debug);

    requestNotificationPermission();
    persist();

    iOSHoverStyles();
    iOSScrollToTop();
  });
} catch (error) {
  if (
    // eslint-disable-next-line no-alert
    confirm(stripIndent`
      Error!

      Confirm to clear local storage and remove ServiceWorker.

      ${(error as Error).name}: "${(error as Error).message}"

      ${(error as Error).stack || '[no stack trace]'}
    `)
  ) {
    localStorage.clear();
  }

  throw error;
}
