import {
  excludePattern,
  Level,
  levelObjectMatch,
} from '@iot/iot-monolith/tree';
import { effect } from '@preact/signals';
import { stripIndents } from 'proper-tags';

import { Api, serialized } from './api.js';
import { init as initReload } from './reload.js';
import { registerServiceWorker } from './sw.js';
import { defer } from './util/defer.js';
import { iOSHoverStyles, iOSScrollToTop } from './util/ios-fixes.js';
import { requestNotificationPermission } from './util/notifications.js';
import { persist } from './util/storage.js';
import { isiPhone } from './util/useragent.js';

export const id = crypto.randomUUID();

export const api = new Api();

try {
  (async () => {
    await api.isInit;
    const { render } = await import('./root.js');

    render();
    document.documentElement.removeAttribute('static');
  })().catch((error) => {
    throw new Error('render error', { cause: error });
  });

  defer(async () => {
    requestNotificationPermission();
    await registerServiceWorker();

    if (isiPhone) {
      iOSHoverStyles();
      iOSScrollToTop();
    }

    await persist();
    initReload();

    await api.isInit;

    const [match] = api.match({ $: 'sunElevation' as const }, excludePattern);

    // eslint-disable-next-line no-console
    console.log({ match, reference: serialized(match?.main.state)?.reference });

    const rooms = api.match(levelObjectMatch[Level.ROOM], excludePattern);
    // eslint-disable-next-line no-console
    console.log({ rooms: rooms.map((room) => room.$) });

    const [office] = api.match({ $: 'office' as const }, excludePattern);

    // eslint-disable-next-line no-console
    console.log(office?.devices.ceilingLight.device.host);

    const $emitter = api.$typedEmitter(serialized(match?.main));
    // eslint-disable-next-line no-console
    effect(() => console.log(match?.$, $emitter.value));
  });
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(stripIndents`
      Error!

      ${(error as Error).name}: "${(error as Error).message}"

      ${(error as Error).stack || '[no stack trace]'}
    `);

  throw error;
}
