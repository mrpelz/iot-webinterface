import { effect, signal } from '@preact/signals';

import { getSignal, readOnly } from '../util/signal.js';
import { $isVisible } from './visibility.js';

const $isBrowserFocused = signal($isVisible.value);

window.addEventListener('focus', () => ($isBrowserFocused.value = true));
window.addEventListener('blur', () => ($isBrowserFocused.value = false));

effect(() => {
  const isVisible = getSignal($isVisible);
  if (isVisible) return;

  $isBrowserFocused.value = false;
});

export const $isFocused = readOnly($isBrowserFocused);
