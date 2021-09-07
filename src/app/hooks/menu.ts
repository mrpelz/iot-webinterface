import { StateUpdater, useContext, useEffect, useState } from 'preact/hooks';
import { createContext } from 'preact';
import { dimensions } from '../style.js';
import { useBreakpoint } from '../style/breakpoint.js';
import { useMediaQuery } from '../style/main.js';

export type TMenuVisibleContext = {
  isMenuVisible: boolean;
  setMenuVisible: StateUpdater<boolean>;
};

export const MenuVisibleContext = createContext<TMenuVisibleContext>(
  null as unknown as TMenuVisibleContext
);

export function useInitMenuVisible(): TMenuVisibleContext {
  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpoint));

  const [isMenuVisible, _setMenuVisible] = useState(false);

  useEffect(() => {
    _setMenuVisible(false);
  }, [isDesktop]);

  return {
    isMenuVisible,
    setMenuVisible: (...args) => {
      if (isDesktop) return;
      _setMenuVisible(...args);
    },
  };
}

export function useIsMenuVisible(): boolean {
  return useContext(MenuVisibleContext).isMenuVisible;
}

export function useSetMenuVisible(): StateUpdater<boolean> {
  return useContext(MenuVisibleContext).setMenuVisible;
}

export function useFlipMenuVisible(): () => void {
  const { setMenuVisible } = useContext(MenuVisibleContext);

  return () => {
    setMenuVisible((value) => !value);
  };
}
