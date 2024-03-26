import { computed, Signal } from '@preact/signals';

import { strings } from '../style.js';
import { breakpoint } from '../style/breakpoint.js';
import { flags } from '../util/flags.js';

const { prefersDarkTheme, prefersLightTheme, prefersMoreContrast } = strings;

export const $isPrefersHighContrastTheme = breakpoint(prefersMoreContrast);
export const $isPrefersDarkTheme = breakpoint(prefersDarkTheme);
export const $isPrefersLightTheme = breakpoint(prefersLightTheme);

export const themes = ['light', 'dark', 'highContrast'] as const;

export type Theme = (typeof themes)[number];

export const $theme = computed(() => {
  const { value: flagPreferredTheme } = flags.theme as Signal<Theme>;

  if (themes.includes(flagPreferredTheme)) return flagPreferredTheme;

  if ($isPrefersHighContrastTheme.value) return 'highContrast';
  if ($isPrefersDarkTheme.value) return 'dark';
  if ($isPrefersLightTheme.value) return 'light';

  return 'light';
});
