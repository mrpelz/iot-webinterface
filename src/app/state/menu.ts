import { effect, signal } from '@preact/signals';

import { dimensions } from '../style.js';
import { $breakpoint } from '../style/breakpoint.js';
import { getMediaQuery } from '../style/main.js';
import { callbackUnwrapped, getSignal, readOnly } from '../util/signal.js';
import { $path, setLeaveCallback } from './path.js';
import { $isScreensaverActive } from './screensaver.js';
import { $isVisible } from './visibility.js';

export type MenuVisible = boolean | null;

const $isDesktop = $breakpoint(getMediaQuery(dimensions.breakpointDesktop));

const $setIsMenuVisible = signal<MenuVisible>($isDesktop.value ? null : false);

export const $isMenuVisible = readOnly($setIsMenuVisible);

effect(() => {
  const isDesktop = getSignal($isDesktop);

  getSignal($isScreensaverActive);
  getSignal($isVisible);
  getSignal($path);

  $setIsMenuVisible.value = isDesktop ? null : false;
});

export const setMenuVisible = callbackUnwrapped(
  ({ isDesktop }, input: boolean) => {
    if (isDesktop) return;

    $setIsMenuVisible.value = input;
  },
  {
    isDesktop: $isDesktop,
  },
);

setLeaveCallback(() => setMenuVisible(false));

export const flipMenuVisible = callbackUnwrapped(
  ({ isVisible }) => setMenuVisible(!isVisible),
  { isVisible: $isMenuVisible },
);
