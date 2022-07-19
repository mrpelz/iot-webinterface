import { FunctionComponent, createContext } from 'preact';
import {
  StateUpdater,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';
import { useLeaveCallbackRef, usePath } from './path.js';
import { dimensions } from '../style.js';
import { useBreakpoint } from '../style/breakpoint.js';
import { useHookDebug } from '../hooks/use-hook-debug.js';
import { useIsScreensaverActive } from './screensaver.js';
import { useMediaQuery } from '../style/main.js';
import { useVisibility } from './visibility.js';

export type MenuVisible = boolean | null;

export type TMenuVisibleContext = {
  flipMenuVisible: () => void;
  isMenuVisible: MenuVisible;
  setMenuVisible: StateUpdater<MenuVisible>;
};

const MenuVisibleContext = createContext<TMenuVisibleContext>(
  null as unknown as TMenuVisibleContext
);

export const MenuVisibleProvider: FunctionComponent = ({ children }) => {
  useHookDebug('MenuVisibleProvider');

  const leaveCallbackRef = useLeaveCallbackRef();

  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpointDesktop));
  const isScreensaverActive = useIsScreensaverActive();
  const isVisible = useVisibility();
  const path = usePath();

  const [isMenuVisible, _setMenuVisible] = useState<MenuVisible>(
    isDesktop ? null : false
  );

  useEffect(() => {
    _setMenuVisible(isDesktop ? null : false);
  }, [isDesktop]);

  const setMenuVisible = useCallback<StateUpdater<MenuVisible>>(
    (...args) => {
      if (isDesktop) return;
      _setMenuVisible(...args);
    },
    [isDesktop]
  );

  const flipMenuVisible = useCallback(() => {
    setMenuVisible((value) => !value);
  }, [setMenuVisible]);

  useEffect(() => {
    if (!leaveCallbackRef) return;
    leaveCallbackRef.current = () => setMenuVisible(true);
  }, [leaveCallbackRef, setMenuVisible]);

  useEffect(() => {
    if (isVisible) return;
    setMenuVisible(false);
  }, [isVisible, setMenuVisible]);

  useEffect(() => {
    setMenuVisible(false);
  }, [path, setMenuVisible]);

  useEffect(() => {
    if (!isScreensaverActive) return;
    setMenuVisible(false);
  }, [isScreensaverActive, setMenuVisible]);

  const value = useMemo<TMenuVisibleContext>(
    () => ({
      flipMenuVisible,
      isMenuVisible,
      setMenuVisible,
    }),
    [flipMenuVisible, isMenuVisible, setMenuVisible]
  );

  return (
    <MenuVisibleContext.Provider value={value}>
      {children}
    </MenuVisibleContext.Provider>
  );
};

export const useIsMenuVisible = (): MenuVisible => {
  const { isMenuVisible } = useContext(MenuVisibleContext);
  return useMemo(() => isMenuVisible, [isMenuVisible]);
};

export const useSetMenuVisible = (): StateUpdater<MenuVisible> => {
  const { setMenuVisible } = useContext(MenuVisibleContext);
  return useMemo(() => setMenuVisible, [setMenuVisible]);
};

export const useFlipMenuVisible = (): (() => void) => {
  const { flipMenuVisible } = useContext(MenuVisibleContext);
  return useMemo(() => flipMenuVisible, [flipMenuVisible]);
};
