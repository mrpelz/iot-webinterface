import { FunctionComponent, createContext } from 'preact';
import { StateUpdater, useState } from 'preact/hooks';
import { defaultTheme } from '../root.js';
import { styled } from 'goober';

const _Menu = styled('nav')`
  min-height: var(--app-height);
`;

export const MenuVisibleContext = createContext(false);

export let setMenuVisible: StateUpdater<boolean> = () => undefined;

export function useMenuVisibleInsert(): boolean {
  const [isMenuVisible, _setMenuVisible] = useState(false);

  const mediaQuery = matchMedia(defaultTheme.breakpoint);
  mediaQuery.onchange = () => _setMenuVisible(false);

  setMenuVisible = (...args) => {
    if (mediaQuery.matches) return;
    _setMenuVisible(...args);
  };

  return isMenuVisible;
}

export function flipMenuVisible(): void {
  setMenuVisible((value) => !value);
}

export const Menu: FunctionComponent = () => {
  return <_Menu>menu</_Menu>;
};
