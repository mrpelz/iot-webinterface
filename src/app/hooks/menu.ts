import { StateUpdater, useContext, useEffect, useState } from 'preact/hooks';
import { createContext } from 'preact';
import { dimension } from '../style/dimensions.js';
import { useBreakpoint } from '../style/breakpoint.js';
import { useMediaQuery } from '../style/main.js';

export type TMenuVisibleContext = {
  isMenuVisible: boolean;
  setMenuVisible: StateUpdater<boolean>;
};

export const MenuVisibleContext = createContext<TMenuVisibleContext>({
  isMenuVisible: false,
  setMenuVisible: () => undefined,
});

export function useInitMenuVisible(): TMenuVisibleContext {
  const isDesktop = useBreakpoint(useMediaQuery(dimension('breakpoint')));

  const [isMenuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    setMenuVisible(false);
  }, [isDesktop]);

  return {
    isMenuVisible,
    setMenuVisible,
  };
}

export function useIsMenuVisible(): boolean {
  return useContext(MenuVisibleContext).isMenuVisible;
}

export function useSetMenuVisible(): StateUpdater<boolean> {
  const isDesktop = useBreakpoint(useMediaQuery(dimension('breakpoint')));

  const { setMenuVisible } = useContext(MenuVisibleContext);

  return (...args) => {
    if (isDesktop) return;
    setMenuVisible(...args);
  };
}

export function useFlipMenuVisible(): () => void {
  const isDesktop = useBreakpoint(useMediaQuery(dimension('breakpoint')));

  const { setMenuVisible } = useContext(MenuVisibleContext);

  return () => {
    if (isDesktop) return;
    setMenuVisible((value) => !value);
  };
}
