import { computed, effect, signal } from '@preact/signals';

import { $flags } from '../util/flags.js';

const getBrowserVisibility = () => document.visibilityState === 'visible';

const $isBrowserVisible = signal(getBrowserVisibility());
document.addEventListener(
  'visibilitychange',
  () => ($isBrowserVisible.value = getBrowserVisibility()),
);

const $setIsInteracting = signal(true);

effect(() => {
  const inactivityTimeout = $flags.inactivityTimeout.value;

  const listenerAbort = new AbortController();

  let timeout: ReturnType<typeof setTimeout> | null = null;
  const abortTimeout = () => {
    if (timeout) clearTimeout(timeout);
    timeout = null;
  };

  if (inactivityTimeout) {
    const onInactivityTimeout = (event?: Event) => {
      abortTimeout();
      $setIsInteracting.value = true;

      if (event?.type === 'pointerdown') return;

      timeout = setTimeout(
        () => ($setIsInteracting.value = false),
        inactivityTimeout,
      );
    };

    const listenerOptions = {
      capture: true,
      passive: true,
      signal: listenerAbort.signal,
    };

    addEventListener('pointerdown', onInactivityTimeout, listenerOptions);
    addEventListener('pointerup', onInactivityTimeout, listenerOptions);
    addEventListener('pointermove', onInactivityTimeout, listenerOptions);
    addEventListener('pointercancel', onInactivityTimeout, listenerOptions);
    addEventListener('scroll', onInactivityTimeout, listenerOptions);

    onInactivityTimeout();
  }

  return () => {
    listenerAbort.abort();
    abortTimeout();

    $setIsInteracting.value = true;
  };
});

export const $isVisible = computed(() => {
  const isBrowserVisible = $isBrowserVisible.value;
  const isInteracting = $setIsInteracting.value;

  return isBrowserVisible && isInteracting;
});
