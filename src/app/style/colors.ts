import { themes } from '../style.js';
import { useTheme } from '../hooks/theme.js';

export type DarkThemeKeys = keyof typeof themes.dark;
export type LightThemeKeys = keyof typeof themes.light;

export type ColorKeys = DarkThemeKeys | LightThemeKeys;

export type Color = (a?: number) => string;

export function useThemedColor(id: ColorKeys, a?: number): string {
  const theme = useTheme();

  return themes[theme][id](a);
}

export const color = (h: number, s: number, l: number): Color => {
  return (a = 0) => {
    if (a) {
      return `hsla(${h}deg ${s}% ${l}% ${a}%)`;
    }

    return `hsl(${h}deg ${s}% ${l}%)`;
  };
};
