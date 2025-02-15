/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  excludePattern,
  Level,
  levelObjectMatch,
} from '@iot/iot-monolith/tree';
import {} from '@iot/iot-monolith/tree-serialization';
import { effect } from '@preact/signals';
import { stripIndent } from 'proper-tags';

import { Api } from './api.js';
import { registerServiceWorker } from './sw.js';
import { defer } from './util/defer.js';
import { iOSHoverStyles, iOSScrollToTop } from './util/ios-fixes.js';
import { requestNotificationPermission } from './util/notifications.js';
import { persist } from './util/storage.js';

export const api = new Api();

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
    // @ts-ignore
    const [match] = api.match({ $: 'sunElevation' as const }, excludePattern);

    // eslint-disable-next-line no-console
    console.log({ match, reference: match?.main.state.reference });

    // @ts-ignore
    const rooms = api.match(levelObjectMatch[Level.ROOM], excludePattern);
    // eslint-disable-next-line no-console
    console.log({ rooms: rooms.map((room) => room.$) });

    // @ts-ignore
    const [office] = api.match({ $: 'office' as const }, excludePattern);

    // eslint-disable-next-line no-console
    console.log(office?.devices.ceilingLight.button);

    const $emitter = api.$typedEmitter(match?.main);
    // eslint-disable-next-line no-console
    effect(() => console.log(match?.$, $emitter.value));
  });
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(stripIndent`
      Error!

      ${(error as Error).name}: "${(error as Error).message}"

      ${(error as Error).stack || '[no stack trace]'}
    `);

  throw error;
}
