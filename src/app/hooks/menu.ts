import { StateUpdater, useContext, useState } from 'preact/hooks';
import { createContext } from 'preact';
import { dimension } from '../style/dimensions.js';
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
  const [isMenuVisible, setMenuVisible] = useState(false);

  const mediaQuery = matchMedia(useMediaQuery(dimension('breakpoint')));
  mediaQuery.onchange = () => {
    setMenuVisible(false);
  };

  return {
    isMenuVisible,
    setMenuVisible,
  };
}

export function useIsMenuVisible(): boolean {
  return useContext(MenuVisibleContext).isMenuVisible;
}

export function useSetMenuVisible(): StateUpdater<boolean> {
  const { setMenuVisible } = useContext(MenuVisibleContext);
  const mediaQuery = matchMedia(useMediaQuery(dimension('breakpoint')));

  return (...args) => {
    if (mediaQuery.matches) return;
    setMenuVisible(...args);
  };
}

export function useFlipMenuVisible(): () => void {
  const { setMenuVisible } = useContext(MenuVisibleContext);
  const mediaQuery = matchMedia(useMediaQuery(dimension('breakpoint')));

  return () => {
    if (mediaQuery.matches) return;
    setMenuVisible((value) => !value);
  };
}
