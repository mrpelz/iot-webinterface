import { Theme, useTheme } from '../hooks/theme.js';

export type Color = (a?: number) => string;

export function useThemedColor(themedColors: Record<Theme, Color>): Color {
  const theme = useTheme();

  return themedColors[theme];
}

export const color = (h: number, s: number, l: number): Color => {
  return (a) => {
    if (a === undefined) {
      return `hsl(${h}deg ${s}% ${l}%)`;
    }

    return `hsla(${h}deg ${s}% ${l}% ${a}%)`;
  };
};
