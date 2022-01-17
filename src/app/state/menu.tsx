import { FunctionComponent, createContext } from 'preact';
import {
  StateUpdater,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';
import { dimensions } from '../style.js';
import { useBreakpoint } from '../style/breakpoint.js';
import { useHookDebug } from '../util/hook-debug.js';
import { useMediaQuery } from '../style/main.js';

export type MenuVisible = boolean | null;

export type TMenuVisibleContext = {
  isMenuVisible: MenuVisible;
  setMenuVisible: StateUpdater<MenuVisible>;
};

const MenuVisibleContext = createContext<TMenuVisibleContext>(
  null as unknown as TMenuVisibleContext
);

export const MenuVisibleProvider: FunctionComponent = ({ children }) => {
  useHookDebug('MenuVisibleProvider');

  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpoint));

  const [isMenuVisible, _setMenuVisible] = useState<MenuVisible>(
    isDesktop ? null : false
  );

  useEffect(() => {
    _setMenuVisible(isDesktop ? null : false);
  }, [isDesktop]);

  const value = useMemo<TMenuVisibleContext>(
    () => ({
      isMenuVisible,
      setMenuVisible: (...args) => {
        if (isDesktop) return;
        _setMenuVisible(...args);
      },
    }),
    [isDesktop, isMenuVisible]
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
  const { setMenuVisible } = useContext(MenuVisibleContext);

  return useCallback(() => {
    setMenuVisible((value) => !value);
  }, [setMenuVisible]);
};
