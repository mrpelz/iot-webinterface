import { computed, signal } from '@preact/signals';
import { useEffect } from 'preact/hooks';

import { delayedSignal } from '../util/signal.js';
import { $theme } from './theme.js';

export const noBackground = Symbol('noBackground');
type NoBackground = typeof noBackground;

const BACKGROUND_PATH = '/assets/';
const BACKGROUND_EXTENSION = '.png';

const camelCase = new RegExp('[A-Z]', 'g');

const $initialDelay = delayedSignal(signal(true), 1000);

const $background_ = signal<string | undefined>(undefined);

const $backgroundOverride = signal<string | NoBackground | undefined>(
  undefined,
);

export const $background = computed(() => {
  if (
    $theme.value === 'highContrast' ||
    !$initialDelay.value ||
    $backgroundOverride.value === noBackground
  ) {
    return undefined;
  }

  const identifier = $backgroundOverride.value ?? $background_.value;
  if (!identifier) return undefined;

  const baseName = encodeURIComponent(
    identifier.replaceAll(camelCase, (letter) => `-${letter.toLowerCase()}`),
  );

  return [BACKGROUND_PATH, baseName, BACKGROUND_EXTENSION].join('');
});

export const setBackground = (background?: string): void => {
  $background_.value = background;
};

export const setBackgroundOverride = (
  override?: string | NoBackground,
): void => {
  $backgroundOverride.value = override;
};

export const useBackgroundOverride: typeof setBackgroundOverride = (
  override,
) => {
  useEffect(() => {
    setBackgroundOverride(override);
  }, [override]);

  useEffect(() => () => setBackgroundOverride(), []);
};
