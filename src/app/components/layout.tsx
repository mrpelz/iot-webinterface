import { FunctionComponent, JSX } from 'preact';
import { styled } from 'goober';
import { useIsMenuVisible } from '../hooks/menu.js';
import { useNotification } from '../hooks/notification.js';

const _Header = styled('header')`
  left: 0;
  position: fixed;
  top: 0;
  touch-action: none;
  width: 100%;
  z-index: 4;
`;

const _Aside = styled('aside')<{ isVisible: boolean; shiftDown: boolean }>`
  left: 0;
  min-height: var(--app-height);
  position: fixed;
  transition: height 0.3s ease-out, transform 0.3s ease-out, top 0.3s ease-out;
  width: 100%;
  width: var(--menu-width);
  z-index: 4;

  top: ${({ shiftDown }) => {
    return shiftDown
      ? 'var(--header-height-shift-down)'
      : 'var(--header-height)';
  }};

  touch-action: ${({ isVisible }) => {
    return isVisible ? 'none' : 'auto';
  }};

  @media not ${({ theme }) => theme.breakpoint} {
    transform: ${({ isVisible }) => {
      return isVisible ? 'translateX(0)' : 'translateX(-100%)';
    }};
  }
`;

const _Main = styled('main')<{ isAsideVisible: boolean; shiftDown: boolean }>`
  overflow-x: hidden;
  transition: height 0.3s ease-out, margin-top 0.3s ease-out;
  width: var(--app-width);

  min-height: ${({ shiftDown }) => {
    return shiftDown ? 'var(--app-height-shift-down)' : 'var(--app-height)';
  }};

  margin-top: ${({ shiftDown }) => {
    return shiftDown
      ? 'var(--header-height-shift-down)'
      : 'var(--header-height)';
  }};

  touch-action: ${({ isAsideVisible }) => {
    return isAsideVisible ? 'none' : 'auto';
  }};

  @media ${({ theme }) => theme.breakpoint} {
    margin-left: var(--menu-width);
  }
`;

export const Layout: FunctionComponent<{
  aside: JSX.Element;
  header: JSX.Element;
}> = ({ aside, children, header }) => {
  const isAsideVisible = useIsMenuVisible();

  const fallbackNotification = useNotification();
  const hasNotification = Boolean(fallbackNotification);

  return (
    <>
      <_Header>{header}</_Header>
      <_Aside isVisible={isAsideVisible} shiftDown={hasNotification}>
        {aside}
      </_Aside>
      <_Main isAsideVisible={isAsideVisible} shiftDown={hasNotification}>
        {children}
      </_Main>
    </>
  );
};
