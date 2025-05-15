import { effect, signal } from '@preact/signals';

import { $flags } from '../util/flags.js';
import { readOnly } from '../util/signal.js';
import { $isVisible } from './visibility.js';

const $setIsScreensaverActive = signal($flags.screensaverEnable.value);

effect(() => {
  if ($flags.screensaverEnable.value) return;

  $setIsScreensaverActive.value = false;
});

export const setScreensaverActive = (active: boolean): void => {
  if (!$flags.screensaverEnable.value) return;

  $setIsScreensaverActive.value = active;
};

export const flipScreensaverActive = (): void => {
  const setIsScreensaverActive = $setIsScreensaverActive.value;
  setScreensaverActive(!setIsScreensaverActive);
};

effect(() => {
  const isVisible = $isVisible.value;
  if (isVisible) return;

  setScreensaverActive(true);
});

export const $isScreensaverActive = readOnly($setIsScreensaverActive);
