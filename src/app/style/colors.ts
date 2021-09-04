import { Theme, useTheme } from '../hooks/theme.js';

export type Color = (a?: number) => string;

export function useThemedValue<T>(themedColors: Record<Theme, T>): T {
  const { theme } = useTheme();

  return themedColors[theme];
}

export const color = (h: number, s: number, l: number): Color => {
  return (a) => {
    if (a === undefined) {
      return `hsl(${h}deg ${s}% ${l}%)`;
    }

    return `hsl(${h}deg ${s}% ${l}% / ${a}%)`;
  };
};
