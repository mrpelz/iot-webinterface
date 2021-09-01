import { Value, useUnwrapValue } from './main.js';
import { colors, themes } from '../style.js';
import { useTheme } from '../hooks/theme.js';

export type SingleColorKeys = keyof typeof colors;
export type DarkThemeKeys = keyof typeof themes.dark;
export type LightThemeKeys = keyof typeof themes.light;

export type ColorKeys = SingleColorKeys | DarkThemeKeys | LightThemeKeys;

export function useColor(id: ColorKeys, alpha?: Value): string {
  const _alpha = useUnwrapValue(alpha || '');
  const theme = useTheme();

  const [h, s, l] = (() => {
    const resolvedId =
      id in themes[theme]
        ? themes[theme][id as DarkThemeKeys | LightThemeKeys]
        : id;

    if (resolvedId in colors) {
      return colors[resolvedId as SingleColorKeys];
    }

    return [0, 0, 0];
  })();

  if (alpha) {
    return `hsla(${h}deg ${s}% ${l}% ${_alpha}%)`;
  }

  return `hsl(${h}deg ${s}% ${l}%)`;
}

export const color = (id: ColorKeys, alpha?: Value): (() => string) => {
  return () => useColor(id, alpha);
};
