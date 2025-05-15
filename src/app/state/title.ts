import { computed, effect, signal } from '@preact/signals';

import { capitalize } from '../util/string.js';
import { $room, $staticPage } from './navigation.js';
import { getTranslation } from './translation.js';

const appName = document.title;

export const noTitle = Symbol('noTitle');
type NoTitle = typeof noTitle;

const $titleOverride = signal<string | NoTitle | undefined>(undefined);

const $staticPageName = getTranslation($staticPage.value);
const $roomName = getTranslation($room.value?.$);

export const $title = computed(() =>
  $titleOverride.value === noTitle
    ? undefined
    : ($titleOverride.value ??
      $staticPageName.value ??
      $staticPage.value ??
      $roomName.value ??
      $room.value?.$),
);

export const $capitalizedTitle = computed(() =>
  $title.value ? capitalize($title.value) : undefined,
);

effect(() => {
  document.title = [$capitalizedTitle.value, appName]
    .filter(Boolean)
    .join(' | ');
});

export const setTitleOverride = (title?: string | NoTitle): void => {
  $titleOverride.value = title;
};
