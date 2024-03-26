import { effect, signal } from '@preact/signals';

import { readOnly } from '../util/signal.js';
import { $isVisible } from './visibility.js';

const $isBrowserFocused = signal($isVisible.value);

window.addEventListener('focus', () => ($isBrowserFocused.value = true));
window.addEventListener('blur', () => ($isBrowserFocused.value = false));

effect(() => {
  const { value: isVisible } = $isVisible;
  if (isVisible) return;

  $isBrowserFocused.value = false;
});

export const $isFocused = readOnly($isBrowserFocused);
