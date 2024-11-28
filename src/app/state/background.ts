import { computed, signal } from '@preact/signals';

import { delayedSignal } from '../util/signal.js';
import { $theme } from './theme.js';

export const noBackground = Symbol('noBackground');
type NoBackground = typeof noBackground;

const BACKGROUND_PATH = '/assets/';
const BACKGROUND_EXTENSION = '.png';

const camelCase = new RegExp('[A-Z]', 'g');

const $initialDelay = delayedSignal(signal(true), 1000);

export const $backgroundOverride = signal<string | NoBackground | null>(null);

export const $background = computed(() => {
  if (
    $theme.value === 'highContrast' ||
    $initialDelay.value ||
    $backgroundOverride.value === noBackground
  ) {
    return null;
  }

  const identifier = $backgroundOverride.value || '' || null;
  if (!identifier) return null;

  const baseName = encodeURIComponent(
    identifier.replaceAll(camelCase, (letter) => `-${letter.toLowerCase()}`),
  );

  return [BACKGROUND_PATH, baseName, BACKGROUND_EXTENSION].join('');
});
