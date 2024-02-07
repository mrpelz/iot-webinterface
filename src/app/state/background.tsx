import { createContext, FunctionComponent } from 'preact';
import {
  StateUpdater,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';

import { useDelay } from '../hooks/use-delay.js';
import { useHookDebug } from '../hooks/use-hook-debug.js';
import { useNavigationRoom, useNavigationStaticPage } from './navigation.js';
import { useTheme } from './theme.js';

export const noBackground = Symbol('noBackground');
type NoBackground = typeof noBackground;

export type TBackgroundContext = readonly [
  string | null,
  StateUpdater<string | NoBackground | null>,
];

const BackgroundContext = createContext(null as unknown as TBackgroundContext);

const BACKGROUND_PATH = '/images/background/';
const BACKGROUND_EXTENSION = '.png';

const camelCase = new RegExp('[A-Z]', 'g');

export const BackgroundProvider: FunctionComponent = ({ children }) => {
  useHookDebug('BackgroundProvider');

  const isHighContrast = useTheme() === 'highContrast';

  const initialDelay = !useDelay(true, 1000);

  const [staticPage] = useNavigationStaticPage();
  const [room] = useNavigationRoom();

  const [backgroundOverride, setBackgroundOverride] = useState<
    string | NoBackground | null
  >(null);

  const background = useMemo(() => {
    if (isHighContrast || initialDelay || backgroundOverride === noBackground) {
      return null;
    }

    const identifier =
      backgroundOverride || staticPage || room?.meta.name || null;
    if (!identifier) return null;

    const baseName = encodeURIComponent(
      identifier.replaceAll(camelCase, (letter) => `-${letter.toLowerCase()}`),
    );

    return [BACKGROUND_PATH, baseName, BACKGROUND_EXTENSION].join('');
  }, [backgroundOverride, initialDelay, isHighContrast, room, staticPage]);

  const value = useMemo(
    () => [background, setBackgroundOverride] as const,
    [background],
  );

  return (
    <BackgroundContext.Provider value={value}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = (): string | null => {
  const [background] = useContext(BackgroundContext);

  return useMemo(() => background, [background]);
};

export const useSetBackgroundOverride = (
  override: string | NoBackground | null,
): void => {
  const [, setBackgroundOverride] = useContext(BackgroundContext);

  useEffect(() => {
    setBackgroundOverride(override);

    return () => setBackgroundOverride(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [override]);
};
