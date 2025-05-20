import { computed, effect, signal } from '@preact/signals';
import { useEffect } from 'preact/hooks';

import { $room, $staticPage } from './navigation.js';
import { getCapitalization, getTranslation } from './translation.js';

const appName = document.title;

export const noTitle = Symbol('noTitle');
type NoTitle = typeof noTitle;

const $titleOverride = signal<string | NoTitle | undefined>(undefined);

const $staticPageName = getTranslation($staticPage);
const $roomName = getTranslation(computed(() => $room.value?.$));

export const $title = computed(() =>
  $titleOverride.value === noTitle
    ? undefined
    : ($titleOverride.value ?? $staticPageName.value ?? $roomName.value),
);

export const $capitalizedTitle = getCapitalization($title);

effect(() => {
  document.title = [$capitalizedTitle.value, appName]
    .filter(Boolean)
    .join(' | ');
});

export const setTitleOverride = (title?: string | NoTitle): void => {
  $titleOverride.value = title;
};

export const useTitleOverride: typeof setTitleOverride = (title) => {
  useEffect(() => {
    setTitleOverride(title);
  }, [title]);

  useEffect(() => () => setTitleOverride(), []);
};
