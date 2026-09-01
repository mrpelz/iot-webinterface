import { effect, signal } from '@preact/signals';
import { Remote, wrap } from 'comlink';
import { Workbox, WorkboxEvent } from 'workbox-window';

import type { PushSubscribeResult, SW_API } from '../common/types.js';
import { webpackServe } from './env.js';
import { installationId } from './main.js';
import { flags$ } from './util/flags.js';
import { readOnly } from './util/signal.js';

export const CHECK_INTERVAL = 15_000;

export let workbox: Workbox | undefined;
export let swProxy: Remote<SW_API> | undefined;

const pushSubscribeResult$_ = signal<PushSubscribeResult>();
export const pushSubscribeResult$ = readOnly(pushSubscribeResult$_);

const wrapSw = (sw: ServiceWorker) => {
  swProxy = wrap({
    addEventListener: (...args) =>
      navigator.serviceWorker.addEventListener(...args),
    postMessage: (message, transfer) => sw.postMessage(message, transfer ?? []),
    removeEventListener: (...args) =>
      navigator.serviceWorker.removeEventListener(...args),
  });
};

export const pushSubscribe = async (topics: string[] = []): Promise<void> => {
  pushSubscribeResult$_.value = await swProxy?.pushSubscribe(
    [`${installationId}-system`, topics].flat(),
  );
};

export const registerServiceWorker = async (): Promise<void> => {
  if (!('serviceWorker' in navigator)) return;

  try {
    workbox = new Workbox('/sw.js');

    workbox.addEventListener('controlling', async ({ sw }) => {
      if (!sw) return;

      wrapSw(sw);
      pushSubscribe();
    });

    const registration = await workbox.register();

    if (registration?.active) {
      workbox.dispatchEvent(
        new WorkboxEvent('controlling', {
          sw: navigator.serviceWorker.controller ?? registration.active,
        }),
      );
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error registering ServiceWorker', error);
  }

  if (webpackServe) return;

  effect(() => {
    const interval = setInterval(
      () => workbox?.update(),
      flags$.updateCheckInterval.value ?? CHECK_INTERVAL,
    );

    return () => clearInterval(interval);
  });
};
