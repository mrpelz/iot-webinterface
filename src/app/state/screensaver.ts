import { effect, signal } from '@preact/signals';

import { flags } from '../util/flags.js';
import { callbackUnwrapped, readOnly } from '../util/signal.js';
import { $isVisible } from './visibility.js';

const $setIsScreensaverActive = signal(flags.screensaverEnable.value);

effect(() => {
  const { value: isScreensaverEnabled } = flags.screensaverEnable;
  if (isScreensaverEnabled) return;

  $setIsScreensaverActive.value = false;
});

export const setScreensaverActive = callbackUnwrapped(
  ({ isEnabled }, active: boolean) => {
    if (!isEnabled) return;

    $setIsScreensaverActive.value = active;
  },
  {
    isEnabled: flags.screensaverEnable,
  },
);

export const flipScreensaverActive = callbackUnwrapped(
  ({ isActive }) => {
    setScreensaverActive(!isActive);
  },
  {
    isActive: $setIsScreensaverActive,
  },
);

effect(() => {
  const { value: isVisible } = $isVisible;
  if (isVisible) return;

  setScreensaverActive(true);
});

export const $isScreensaverActive = readOnly($setIsScreensaverActive);
