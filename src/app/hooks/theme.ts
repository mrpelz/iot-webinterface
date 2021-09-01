import { StateUpdater, useContext, useState } from 'preact/hooks';
import { createContext } from 'preact';
import { useString } from '../style/main.js';

export type Theme = 'light' | 'dark';

type InitTheme = {
  setTheme: StateUpdater<Theme>;
  theme: Theme;
};

export const ThemeContext = createContext<InitTheme>(
  null as unknown as InitTheme
);

export function useInitTheme(): InitTheme {
  const prefersDarkTheme = matchMedia(useString('prefersDarkTheme')).matches;
  const prefersLightTheme = matchMedia(useString('prefersLightTheme')).matches;

  const [theme, setTheme] = useState<Theme>(
    (() => {
      if (prefersDarkTheme) return 'dark';
      if (prefersLightTheme) return 'light';

      return 'light';
    })()
  );

  return {
    setTheme,
    theme,
  };
}

export function useTheme(): Theme {
  return useContext(ThemeContext).theme;
}
