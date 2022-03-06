import { FunctionComponent, createContext } from 'preact';
import { useContext, useMemo } from 'preact/hooks';
import { strings } from '../style.js';
import { useBreakpoint } from '../style/breakpoint.js';
import { useFlag } from './flags.js';
import { useHookDebug } from '../util/use-hook-debug.js';

export const themes = ['light', 'dark', 'highContrast'] as const;

export type Theme = typeof themes[number];

const ThemeContext = createContext(null as unknown as Theme);

export const ThemeProvider: FunctionComponent = ({ children }) => {
  useHookDebug('ThemeProvider');

  const flagPreferredTheme = useFlag('theme');

  const prefersDarkTheme = useBreakpoint(strings.prefersDarkTheme);
  const prefersLightTheme = useBreakpoint(strings.prefersLightTheme);

  const browserPreferredTheme = useMemo(() => {
    if (prefersDarkTheme) return 'dark';
    if (prefersLightTheme) return 'light';

    return null;
  }, [prefersDarkTheme, prefersLightTheme]);

  const value = useMemo(
    () =>
      (themes.includes(flagPreferredTheme as Theme)
        ? (flagPreferredTheme as Theme)
        : null) ||
      browserPreferredTheme ||
      'light',

    [browserPreferredTheme, flagPreferredTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): Theme => {
  return useContext(ThemeContext);
};
