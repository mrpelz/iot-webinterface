import { FunctionComponent, JSX } from 'preact';
import { MenuVisible, useIsMenuVisible } from '../hooks/menu.js';
import { colors, dimensions } from '../style.js';
import { dependentValue, mediaQuery } from '../style/main.js';
import { breakpointValue } from '../style/breakpoint.js';
import { styled } from 'goober';
import { useNotification } from '../hooks/notification.js';

const _Header = styled('header')`
  background-color: ${colors.backgroundSecondary()};
  left: 0;
  position: fixed;
  top: 0;
  touch-action: none;
  width: 100%;
  z-index: 4;
`;

const _Aside = styled('aside')<{ isVisible: MenuVisible; shiftDown: boolean }>`
  height: ${dimensions.appHeight};
  left: 0;
  position: fixed;
  touch-action: ${dependentValue('isVisible', 'none', 'auto')};
  transition: height 0.3s ease-out, transform 0.3s ease-out, top 0.3s ease-out;
  width: ${dimensions.menuWidth};
  z-index: 4;

  top: ${dependentValue(
    'shiftDown',
    dimensions.headerHeightShiftDown,
    dimensions.headerHeight
  )};

  transform: ${dependentValue(
    'isVisible',
    'translateX(0)',
    breakpointValue(
      mediaQuery(dimensions.breakpoint),
      'translateX(0)',
      'translateX(-100%)'
    )
  )};
`;

const _Main = styled('main')<{
  isAsideVisible: MenuVisible;
  shiftDown: boolean;
}>`
  min-height: ${dependentValue(
    'shiftDown',
    dimensions.appHeightShiftDown,
    dimensions.appHeight
  )};
  overflow-x: hidden;
  touch-action: ${dependentValue('isAsideVisible', 'none', 'auto')};
  transition: height 0.3s ease-out, margin-top 0.3s ease-out;
  width: ${dimensions.appWidth};
  color: ${colors.fontPrimary()};

  margin-top: ${dependentValue(
    'shiftDown',
    dimensions.headerHeightShiftDown,
    dimensions.headerHeight
  )};

  margin-left: ${breakpointValue(
    mediaQuery(dimensions.breakpoint),
    dimensions.menuWidth,
    'unset'
  )};
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
