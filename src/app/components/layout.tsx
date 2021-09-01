import { FunctionComponent, JSX } from 'preact';
import { dependentValue, mediaQuery, useString } from '../style/main.js';
import {
  dimension,
  useAddition,
  useDimension,
  useSubtraction,
} from '../style/dimensions.js';
import { styled } from 'goober';
import { useIsMenuVisible } from '../hooks/menu.js';
import { useNotification } from '../hooks/notification.js';

export const appWidthDesktop = (): (() => string) => {
  return () =>
    useSubtraction(useString('viewportWidth'), useDimension('menuWidth'));
};

export const appWidthMobile = (): (() => string) => {
  return () => useString('viewportWidth');
};

export const appHeight = (): (() => string) => {
  return () =>
    useSubtraction(
      useString('viewportHeight'),
      useString('safeAreaInsetTop'),
      useDimension('titlebarHeight')
    );
};

export const appHeightShiftDown = (): (() => string) => {
  return () =>
    useSubtraction(
      useString('viewportHeight'),
      useString('safeAreaInsetTop'),
      useDimension('titlebarHeight'),
      useDimension('titlebarHeight')
    );
};

export const headerHeight = (): (() => string) => {
  return () =>
    useAddition(useString('safeAreaInsetTop'), useDimension('titlebarHeight'));
};

export const headerHeightShiftDown = (): (() => string) => {
  return () =>
    useAddition(
      useString('safeAreaInsetTop'),
      useDimension('titlebarHeight'),
      useDimension('titlebarHeight')
    );
};

const _Header = styled('header')`
  left: 0;
  position: fixed;
  top: 0;
  touch-action: none;
  width: 100%;
  z-index: 4;
`;

const _Aside = styled('aside')<{ isVisible: boolean; shiftDown: boolean }>`
  height: ${appHeight()};
  left: 0;
  position: fixed;
  touch-action: ${dependentValue('isVisible', 'none', 'auto')};
  transition: height 0.3s ease-out, transform 0.3s ease-out, top 0.3s ease-out;
  width: ${dimension('menuWidth')};
  z-index: 4;

  top: ${dependentValue('shiftDown', headerHeightShiftDown(), headerHeight())};

  @media ${mediaQuery(dimension('breakpoint'), true)} {
    transform: ${dependentValue(
      'isVisible',
      'translateX(0)',
      'translateX(-100%)'
    )};
  }
`;

const _Main = styled('main')<{ isAsideVisible: boolean; shiftDown: boolean }>`
  min-height: ${dependentValue('shiftDown', appHeightShiftDown(), appHeight())};
  overflow-x: hidden;
  touch-action: ${dependentValue('isAsideVisible', 'none', 'auto')};
  transition: height 0.3s ease-out, margin-top 0.3s ease-out;
  width: ${appWidthMobile()};

  margin-top: ${dependentValue(
    'shiftDown',
    headerHeightShiftDown(),
    headerHeight()
  )};

  @media ${mediaQuery(dimension('breakpoint'))} {
    margin-left: ${dimension('menuWidth')};
    width: ${appWidthDesktop()};
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
