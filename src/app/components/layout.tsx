import { FunctionComponent, JSX } from 'preact';
import {
  MenuVisible,
  useIsMenuVisible,
  useSetMenuVisible,
} from '../hooks/menu.js';
import { breakpointValue, useBreakpoint } from '../style/breakpoint.js';
import { colors, dimensions } from '../style.js';
import { dependentValue, mediaQuery, useMediaQuery } from '../style/main.js';
import { useEffect, useMemo, useRef } from 'preact/hooks';
import { forwardRef } from 'preact/compat';
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

const _Aside = styled('aside', forwardRef)<{
  isVisible: MenuVisible;
  shiftDown: boolean;
}>`
  height: ${dimensions.appHeight};
  left: 0;
  position: fixed;
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
    'translate3d(0, 0, 0)',
    breakpointValue(
      mediaQuery(dimensions.breakpoint),
      'translate3d(0, 0, 0)',
      'translate3d(-100%, 0, 0)'
    )
  )};
`;

const _Main = styled('article', forwardRef)<{
  isAsideVisible: MenuVisible;
  shiftDown: boolean;
}>`
  background-color: ${colors.backgroundPrimary()};
  color: ${colors.fontPrimary()};
  position: relative;
  touch-action: ${dependentValue('isAsideVisible', 'none', 'auto')};
  transition: height 0.3s ease-out, margin-top 0.3s ease-out;
  width: ${dimensions.appWidth};
  z-index: 2;

  min-height: ${dependentValue(
    'shiftDown',
    dimensions.appHeightShiftDown,
    dimensions.appHeight
  )};

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
  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpoint));

  const isAsideVisible = useIsMenuVisible();
  const setAsideVisible = useSetMenuVisible();

  const fallbackNotification = useNotification();
  const hasNotification = Boolean(fallbackNotification);

  const asideRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const { current: asideCurrent } = asideRef;
    const { current: mainCurrent } = mainRef;

    if (!asideCurrent || !mainCurrent) return undefined;

    let lastX = 0;

    const setTransform = (input: number) => {
      lastX = input;

      const { style } = asideCurrent;

      style.transition = input ? 'none' : '';
      style.touchAction = input ? 'pan-x' : '';

      style.transform = input
        ? `translate3d(calc(-100% + ${input}px), 0, 0)`
        : '';
    };

    const onTouchStart: (
      this: HTMLElement,
      ev: HTMLElementEventMap['touchstart']
    ) => void = ({ targetTouches }) => {
      if (isAsideVisible) return;

      const x = targetTouches.item(0)?.pageX || 0;

      if (!x) return;
      if (x > 20) return;

      setTransform(x);
    };

    const onTouchMove: (
      this: HTMLElement,
      ev: HTMLElementEventMap['touchmove']
    ) => void = ({ targetTouches }) => {
      if (!lastX || isAsideVisible) return;

      const x = targetTouches.item(0)?.pageX || 0;

      if (!x) return;
      if (x > asideCurrent.offsetWidth) return;

      setTransform(x);
    };

    const onTouchEnd: (
      this: HTMLElement,
      ev: HTMLElementEventMap['touchend']
    ) => void = () => {
      if (!lastX || isAsideVisible) return;

      if (lastX > asideCurrent.offsetWidth / 3) {
        setAsideVisible(true);
      }

      setTransform(0);
    };

    const onTouchCancel: (
      this: HTMLElement,
      ev: HTMLElementEventMap['touchcancel']
    ) => void = () => {
      if (!lastX || isAsideVisible) return;

      setTransform(0);
    };

    mainCurrent.addEventListener('touchstart', onTouchStart);
    mainCurrent.addEventListener('touchmove', onTouchMove);
    mainCurrent.addEventListener('touchend', onTouchEnd);
    mainCurrent.addEventListener('touchcancel', onTouchCancel);

    return () => {
      setTransform(0);

      mainCurrent.removeEventListener('touchstart', onTouchStart);
      mainCurrent.removeEventListener('touchmove', onTouchMove);
      mainCurrent.removeEventListener('touchend', onTouchEnd);
      mainCurrent.removeEventListener('touchcancel', onTouchCancel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!asideRef.current) return;

    const { style } = asideRef.current;
    style.transform = '';
  }, [isDesktop]);

  const handleAsideOutsideClick = useMemo<
    JSX.UIEventHandler<HTMLElement> | undefined
  >(() => {
    return isAsideVisible
      ? (event) => {
          setAsideVisible(false);
          event.preventDefault();
        }
      : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAsideVisible]);

  return (
    <>
      <_Header>{header}</_Header>
      <_Aside
        isVisible={isAsideVisible}
        shiftDown={hasNotification}
        ref={asideRef}
      >
        {aside}
      </_Aside>
      <_Main
        isAsideVisible={isAsideVisible}
        shiftDown={hasNotification}
        ref={mainRef}
        onClickCapture={handleAsideOutsideClick}
      >
        {children}
      </_Main>
    </>
  );
};
