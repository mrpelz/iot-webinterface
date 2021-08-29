import { Theme, defaultTheme } from '../theme.js';
import { useContext, useState } from 'preact/hooks';
import { createContext } from 'preact';

type InitTheme = {
  setTheme: (theme: string) => void;
  theme: Theme;
};

export const ThemeContext = createContext<InitTheme>(
  null as unknown as InitTheme
);

export function useInitTheme(): InitTheme {
  const [theme, _setTheme] = useState<Theme>(defaultTheme);

  return {
    setTheme: () => null,
    theme,
  };
}

export function useTheme(): Theme {
  return useContext(ThemeContext).theme;
}
