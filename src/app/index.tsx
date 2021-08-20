import { h, render } from 'preact';
import { iOSHoverStyles, iOSScrollToTop } from './util/ios-fixes.js';
import {
  installServiceWorker,
  removeServiceWorkers,
  swUrl,
} from './util/workers.js';
import { App } from './app.js';
import { WebApi } from './util/web-api.js';
import { autoReload } from './util/auto-reload.js';
import { getFlags } from './util/flags.js';
import { requestNotificationPermission } from './util/notifications.js';
import { setup } from 'goober';

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
render(<App flags={flags} webApi={webApi} />, document.body);

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

  webApi.createGetter<number>(71, (value) => {
    // eslint-disable-next-line no-console
    console.info('temperature', value);
  });

  webApi.createGetter<number>(66, (value) => {
    // eslint-disable-next-line no-console
    console.info('pressure', value);
  });

  webApi.createGetter<number>(55, (value) => {
    // eslint-disable-next-line no-console
    console.info('pm025', value);
  });
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
