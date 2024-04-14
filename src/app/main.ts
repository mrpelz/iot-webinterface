import { stripIndent } from 'proper-tags';

import { Api } from './api.js';
import { render } from './root.js';
import { registerServiceWorker } from './sw.js';
import { defer } from './util/defer.js';
import { $flags } from './util/flags.js';
import { iOSHoverStyles, iOSScrollToTop } from './util/ios-fixes.js';
import { requestNotificationPermission } from './util/notifications.js';
import { persist } from './util/storage.js';
import { WebApi } from './web-api.js';

try {
  const { apiBaseUrl, debug, updateCheckInterval } = $flags;

  const webApi = new WebApi(apiBaseUrl.value, debug.value);

  // eslint-disable-next-line no-new
  new Api();

  render(webApi);
  document.documentElement.removeAttribute('static');

  defer(async () => {
    requestNotificationPermission();
    await registerServiceWorker(updateCheckInterval.value ?? undefined);

    iOSHoverStyles();
    iOSScrollToTop();

    await persist();
  });
} catch (error) {
  // eslint-disable-next-line no-alert
  alert(stripIndent`
      Error!

      Confirm to clear local storage and remove ServiceWorker.

      ${(error as Error).name}: "${(error as Error).message}"

      ${(error as Error).stack || '[no stack trace]'}
    `);

  throw error;
}
