import { createContext, FunctionComponent } from 'preact';
import {
  Dispatch,
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
  string | undefined,
  Dispatch<StateUpdater<string | NoBackground | undefined>>,
];

const BackgroundContext = createContext(
  undefined as unknown as TBackgroundContext,
);

const BACKGROUND_PATH = '/assets/';
const BACKGROUND_EXTENSION = '.png';

const camelCase = new RegExp('[A-Z]', 'g');

export const BackgroundProvider: FunctionComponent = ({ children }) => {
  useHookDebug('BackgroundProvider');

  const isHighContrast = useTheme() === 'highContrast';

  const initialDelay = !useDelay(true, 1000);

  const [staticPage] = useNavigationStaticPage();
  const [room] = useNavigationRoom();

  const [backgroundOverride, setBackgroundOverride] = useState<
    string | NoBackground | undefined
  >(undefined);

  const background = useMemo(() => {
    if (isHighContrast || initialDelay || backgroundOverride === noBackground) {
      return undefined;
    }

    const identifier = backgroundOverride || staticPage || room?.$ || undefined;
    if (!identifier) return undefined;

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

export const useBackground = (): string | undefined => {
  const [background] = useContext(BackgroundContext);

  return useMemo(() => background, [background]);
};

export const useSetBackgroundOverride = (
  override: string | NoBackground | undefined,
): void => {
  const [, setBackgroundOverride] = useContext(BackgroundContext);

  useEffect(() => {
    setBackgroundOverride(override);

    return () => setBackgroundOverride(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [override]);
};
