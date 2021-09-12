import {
  StateUpdater,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';
import { Flags } from '../util/flags.js';
import { createContext } from 'preact';
import { strings } from '../style.js';
import { useBreakpoint } from '../style/breakpoint.js';

export const themes = ['light', 'dark', 'dim'] as const;

export type Theme = typeof themes[number];

type InitTheme = {
  setTheme: StateUpdater<Theme>;
  theme: Theme;
};

export const ThemeContext = createContext<InitTheme>(
  null as unknown as InitTheme
);

export function useInitTheme(flags: Flags): InitTheme {
  const { theme: flagPreferredTheme } = flags;

  const prefersDarkTheme = useBreakpoint(strings.prefersDarkTheme);
  const prefersLightTheme = useBreakpoint(strings.prefersLightTheme);

  const browserPreferredTheme = useMemo(() => {
    if (prefersDarkTheme) return 'dark';
    if (prefersLightTheme) return 'light';

    return null;
  }, [prefersDarkTheme, prefersLightTheme]);

  const preferredTheme = useMemo(
    () => flagPreferredTheme || browserPreferredTheme || 'light',
    [browserPreferredTheme, flagPreferredTheme]
  );

  const [theme, setTheme] = useState<Theme>(preferredTheme);

  useEffect(() => {
    setTheme(preferredTheme);
  }, [preferredTheme]);

  return {
    setTheme,
    theme,
  };
}

export function useTheme(): InitTheme {
  return useContext(ThemeContext);
}
