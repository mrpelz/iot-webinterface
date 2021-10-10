import { FunctionComponent, createContext } from 'preact';
import { StateUpdater, useContext, useEffect, useState } from 'preact/hooks';
import { dimensions } from '../style.js';
import { useBreakpoint } from '../style/breakpoint.js';
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
  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpoint));

  const [isMenuVisible, _setMenuVisible] = useState<MenuVisible>(
    isDesktop ? null : false
  );

  useEffect(() => {
    _setMenuVisible(isDesktop ? null : false);
  }, [isDesktop]);

  return (
    <MenuVisibleContext.Provider
      value={{
        isMenuVisible,
        setMenuVisible: (...args) => {
          if (isDesktop) return;
          _setMenuVisible(...args);
        },
      }}
    >
      {children}
    </MenuVisibleContext.Provider>
  );
};

export function useIsMenuVisible(): MenuVisible {
  return useContext(MenuVisibleContext).isMenuVisible;
}

export function useSetMenuVisible(): StateUpdater<MenuVisible> {
  return useContext(MenuVisibleContext).setMenuVisible;
}

export function useFlipMenuVisible(): () => void {
  const setMenuVisible = useSetMenuVisible();

  return () => {
    setMenuVisible((value) => !value);
  };
}
