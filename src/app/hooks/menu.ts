import { StateUpdater, useContext, useEffect, useState } from 'preact/hooks';
import { createContext } from 'preact';
import { dimensions } from '../style.js';
import { useBreakpoint } from '../style/breakpoint.js';
import { useMediaQuery } from '../style/main.js';

export type MenuVisible = boolean | null;

export type TMenuVisibleContext = {
  isMenuVisible: MenuVisible;
  setMenuVisible: StateUpdater<MenuVisible>;
};

export const MenuVisibleContext = createContext<TMenuVisibleContext>(
  null as unknown as TMenuVisibleContext
);

export function useInitMenuVisible(): TMenuVisibleContext {
  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpoint));

  const [isMenuVisible, _setMenuVisible] = useState<MenuVisible>(
    isDesktop ? null : false
  );

  useEffect(() => {
    _setMenuVisible(isDesktop ? null : false);
  }, [isDesktop]);

  return {
    isMenuVisible,
    setMenuVisible: (...args) => {
      if (isDesktop) return;
      _setMenuVisible(...args);
    },
  };
}

export function useIsMenuVisible(): MenuVisible {
  return useContext(MenuVisibleContext).isMenuVisible;
}

export function useSetMenuVisible(): StateUpdater<MenuVisible> {
  return useContext(MenuVisibleContext).setMenuVisible;
}

export function useFlipMenuVisible(): () => void {
  const { setMenuVisible } = useContext(MenuVisibleContext);

  return () => {
    setMenuVisible((value) => !value);
  };
}
