import { FunctionComponent, createContext } from 'preact';
import {
  StateUpdater,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';
import { strings } from '../style.js';
import { useBreakpoint } from '../style/breakpoint.js';
import { useFlags } from './flags.js';

export const themes = ['light', 'dark', 'dim'] as const;

export type Theme = typeof themes[number];

type InitTheme = {
  setTheme: StateUpdater<Theme>;
  theme: Theme;
};

const ThemeContext = createContext<InitTheme>(null as unknown as InitTheme);

export const ThemeProvider: FunctionComponent = ({ children }) => {
  const { theme: flagPreferredTheme } = useFlags();

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

  return (
    <ThemeContext.Provider
      value={{
        setTheme,
        theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): InitTheme {
  return useContext(ThemeContext);
}
