import { stripIndent } from 'proper-tags';

import { api } from './api.js';
import { registerServiceWorker } from './sw.js';
import { defer } from './util/defer.js';
import { iOSHoverStyles, iOSScrollToTop } from './util/ios-fixes.js';
import { requestNotificationPermission } from './util/notifications.js';
import { persist } from './util/storage.js';

try {
  (async () => {
    await api.isInit;
    const { render } = await import('./root.js');

    render();
    document.documentElement.removeAttribute('static');
  })();

  defer(async () => {
    requestNotificationPermission();
    await registerServiceWorker();

    iOSHoverStyles();
    iOSScrollToTop();

    await persist();

    await api.isInit;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [match] = api.match({ $: 'sunElevation' } as const, 2);

    // eslint-disable-next-line no-console
    console.log({ match, reference: match.main.state.reference });
  });
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(stripIndent`
      Error!

      Confirm to clear local storage and remove ServiceWorker.

      ${(error as Error).name}: "${(error as Error).message}"

      ${(error as Error).stack || '[no stack trace]'}
    `);

  throw error;
}
