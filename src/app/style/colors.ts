import { $theme, Theme } from '../state/theme.js';

export type Color = (a?: number) => string;

export const useThemedValue = <T>(
  themedColors: Record<Theme, T>,
  themeOverride?: Theme,
): T => {
  const { value: theme } = $theme;

  return themedColors[themeOverride || theme];
};

export const color =
  (h: number, s: number, l: number): Color =>
  (a) => {
    if (a === undefined) {
      return `hsl(${h}deg ${s}% ${l}%)`;
    }

    return `hsl(${h}deg ${s}% ${l}% / ${a}%)`;
  };
