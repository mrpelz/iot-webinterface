import { StateUpdater, useContext, useEffect, useState } from 'preact/hooks';
import { Flags } from '../util/flags.js';
import { createContext } from 'preact';
import { useBreakpoint } from '../style/breakpoint.js';
import { useString } from '../style/main.js';

export type Theme = 'light' | 'dark';

type InitTheme = {
  setTheme: StateUpdater<Theme>;
  theme: Theme;
};

export const ThemeContext = createContext<InitTheme>(
  null as unknown as InitTheme
);

export function useInitTheme(flags: Flags): InitTheme {
  const prefersDarkTheme = useBreakpoint(useString('prefersDarkTheme'));
  const prefersLightTheme = useBreakpoint(useString('prefersLightTheme'));

  const [theme, setTheme] = useState<Theme>(
    (() => {
      if (prefersDarkTheme) return 'dark';
      if (prefersLightTheme) return 'light';

      return 'light';
    })()
  );

  useEffect(() => {
    const browserPreferredTheme = (() => {
      if (prefersDarkTheme) return 'dark';
      if (prefersLightTheme) return 'light';

      return null;
    })();

    const flagPreferredTheme = (() => {
      const { darkOverride = null } = flags || {};
      if (darkOverride === null) return null;

      if (darkOverride) return 'dark';
      return 'light';
    })();

    setTheme(flagPreferredTheme || browserPreferredTheme || 'light');
  }, [flags, prefersDarkTheme, prefersLightTheme]);

  return {
    setTheme,
    theme,
  };
}

export function useTheme(): Theme {
  return useContext(ThemeContext).theme;
}
