import { createContext, FunctionComponent } from 'preact';
import {
  Dispatch,
  StateUpdater,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';

import { useHookDebug } from '../hooks/use-hook-debug.js';
import { $flags } from '../util/flags.js';
import { useVisibility } from './visibility.js';

export type TScreensaverActiveContext = {
  flipScreensaverActive: () => void;
  isScreensaverActive: boolean;
  setScreensaverActive: Dispatch<StateUpdater<boolean>>;
};

const ScreensaverActiveContext = createContext<TScreensaverActiveContext>(
  null as unknown as TScreensaverActiveContext,
);

export const ScreensaverActiveProvider: FunctionComponent = ({ children }) => {
  useHookDebug('ScreensaverActiveProvider');

  const isScreensaverEnabled = $flags.screensaverEnable.value;
  const isVisible = useVisibility();

  const [isScreensaverActive, _setScreensaverActive] = useState(
    Boolean(isScreensaverEnabled),
  );

  useEffect(() => {
    if (isScreensaverEnabled) return;
    _setScreensaverActive(false);
  }, [isScreensaverEnabled]);

  const setScreensaverActive = useCallback<Dispatch<StateUpdater<boolean>>>(
    (...args) => {
      if (!isScreensaverEnabled) return;
      _setScreensaverActive(...args);
    },
    [isScreensaverEnabled],
  );

  useEffect(() => {
    if (isVisible) return;
    setScreensaverActive(true);
  }, [isVisible, setScreensaverActive]);

  const flipScreensaverActive = useCallback(() => {
    setScreensaverActive((value) => !value);
  }, [setScreensaverActive]);

  const value = useMemo<TScreensaverActiveContext>(
    () => ({
      flipScreensaverActive,
      isScreensaverActive,
      setScreensaverActive,
    }),
    [flipScreensaverActive, isScreensaverActive, setScreensaverActive],
  );

  return (
    <ScreensaverActiveContext.Provider value={value}>
      {children}
    </ScreensaverActiveContext.Provider>
  );
};

export const useIsScreensaverActive = (): boolean => {
  const { isScreensaverActive } = useContext(ScreensaverActiveContext);
  return useMemo(() => isScreensaverActive, [isScreensaverActive]);
};

export const useSetScreensaverActive = (): Dispatch<StateUpdater<boolean>> => {
  const { setScreensaverActive } = useContext(ScreensaverActiveContext);
  return useMemo(() => setScreensaverActive, [setScreensaverActive]);
};

export const useFlipScreensaverActive = (): (() => void) => {
  const { flipScreensaverActive } = useContext(ScreensaverActiveContext);
  return useMemo(() => flipScreensaverActive, [flipScreensaverActive]);
};
