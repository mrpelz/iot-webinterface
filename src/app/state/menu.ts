import { effect, signal } from '@preact/signals';

import { dimensions } from '../style.js';
import { $breakpoint } from '../style/breakpoint.js';
import { getMediaQuery } from '../style/main.js';
import { readOnly } from '../util/signal.js';
import { $path, setLeaveCallback } from './path.js';
import { $isScreensaverActive } from './screensaver.js';
import { $isVisible } from './visibility.js';

export type MenuVisible = boolean | null;

const $isDesktop = $breakpoint(getMediaQuery(dimensions.breakpointDesktop));

const $setIsMenuVisible = signal<MenuVisible>($isDesktop.value ? null : false);

export const $isMenuVisible = readOnly($setIsMenuVisible);

effect(() => {
  const isDesktop = $isDesktop.value;

  // eslint-disable-next-line no-unused-expressions
  $isScreensaverActive.value;
  // eslint-disable-next-line no-unused-expressions
  $isVisible.value;
  // eslint-disable-next-line no-unused-expressions
  $path.value;

  $setIsMenuVisible.value = isDesktop ? null : false;
});

export const setMenuVisible = (input: boolean): void => {
  const isDesktop = $isDesktop.value;
  if (isDesktop) return;

  $setIsMenuVisible.value = input;
};

setLeaveCallback(() => setMenuVisible(false));

export const flipMenuVisible = (): void => {
  const isVisible = $isMenuVisible.value;
  setMenuVisible(!isVisible);
};
