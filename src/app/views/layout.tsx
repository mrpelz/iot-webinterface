import { FunctionComponent, JSX } from 'preact';
import { useLayoutEffect, useMemo, useRef } from 'preact/hooks';

import { Aside, Header, Main } from '../components/layout.js';
import { MenuShade } from '../components/menu.js';
import { $isMenuVisible, MenuVisible, setMenuVisible } from '../state/menu.js';
import { $isRoot, goUp } from '../state/path.js';
import { $isScreensaverActive } from '../state/screensaver.js';
import { dimensions } from '../style.js';
import { useBreakpoint } from '../style/breakpoint.js';
import { getMediaQuery } from '../style/main.js';
import { Menu } from './menu.js';
import { StatusBar } from './status-bar.js';
import { SwipeBack } from './swipe-back.js';
import { Titlebar } from './titlebar.js';

export const swipeCaptureWidth = 30;

export const Layout: FunctionComponent = ({ children }) => {
  const isDesktop = useBreakpoint(getMediaQuery(dimensions.breakpointDesktop));

  const isAsideVisible = $isMenuVisible.value;
  const isScreensaverActive = $isScreensaverActive.value;

  const menuRef = useRef<HTMLElement>(null);
  const menuShadeRef = useRef<HTMLDivElement>(null);

  const swipeBackRef = useRef<HTMLElement>(null);

  const mainRef = useRef<HTMLElement>(null);

  const isAsideVisibleRef = useRef<MenuVisible>(null);

  const isRoot = $isRoot.value;

  useLayoutEffect(() => {
    isAsideVisibleRef.current = isAsideVisible;
  }, [isAsideVisible]);

  useLayoutEffect(() => {
    const { current: mainCurrent } = mainRef;

    if (!mainCurrent || !menuRef.current) return undefined;

    let lastX = 0;

    const setTransform = (input: number) => {
      if (!menuRef.current || !menuShadeRef.current) return;
      if (input === lastX) return;

      const slideElement = swipeBackRef.current || menuRef.current;

      lastX = input;

      const { style: asideStyle, offsetWidth } = slideElement;
      const { style: shadeStyle } = menuShadeRef.current;

      asideStyle.transition = input ? 'none' : '';
      asideStyle.touchAction = input ? 'pan-x' : '';

      asideStyle.transform = input
        ? `translate3d(calc(-100% + ${input}px), 0, 0)`
        : '';

      if (swipeBackRef.current) return;

      shadeStyle.transition = input ? 'none' : '';
      shadeStyle.opacity = input
        ? ((input / offsetWidth) * 0.5).toString()
        : '';
    };

    const onTouchStart: (
      this: HTMLElement,
      event: HTMLElementEventMap['touchstart'],
    ) => void = ({ targetTouches }) => {
      if (isAsideVisibleRef.current) return;

      const x = targetTouches.item(0)?.pageX || 0;

      if (!x) return;
      if (x > swipeCaptureWidth) return;

      setTransform(x);
    };

    const onTouchMove: (
      this: HTMLElement,
      event: HTMLElementEventMap['touchmove'],
    ) => void = (event) => {
      if (!menuRef.current) return;

      const slideElement = swipeBackRef.current || menuRef.current;

      const { targetTouches } = event;

      if (!lastX || isAsideVisibleRef.current) return;

      const x = targetTouches.item(0)?.pageX || 0;

      if (!x) return;

      event.preventDefault();
      setTransform(Math.min(x, slideElement.offsetWidth));
    };

    const onTouchEnd: (
      this: HTMLElement,
      event: HTMLElementEventMap['touchend'],
    ) => void = () => {
      if (!menuRef.current) return;

      const slideElement = swipeBackRef.current || menuRef.current;

      if (!lastX || isAsideVisibleRef.current) return;

      if (slideElement !== menuRef.current) {
        if (lastX >= slideElement.offsetWidth - 1) {
          goUp();
        }
      } else if (lastX >= slideElement.offsetWidth / 3) {
        setMenuVisible(true);
      }

      setTransform(0);
    };

    const onTouchCancel: (
      this: HTMLElement,
      event: HTMLElementEventMap['touchcancel'],
    ) => void = () => {
      if (!lastX || isAsideVisibleRef.current) return;

      setTransform(0);
    };

    mainCurrent.addEventListener('touchstart', onTouchStart, { passive: true });
    mainCurrent.addEventListener('touchmove', onTouchMove, { passive: false });
    mainCurrent.addEventListener('touchend', onTouchEnd, { passive: true });
    mainCurrent.addEventListener('touchcancel', onTouchCancel, {
      passive: true,
    });

    return () => {
      setTransform(0);

      mainCurrent.removeEventListener('touchstart', onTouchStart);
      mainCurrent.removeEventListener('touchmove', onTouchMove);
      mainCurrent.removeEventListener('touchend', onTouchEnd);
      mainCurrent.removeEventListener('touchcancel', onTouchCancel);
    };
  }, []);

  useLayoutEffect(() => {
    if (!menuRef.current) return;

    const { style } = menuRef.current;
    style.transform = '';
  }, [isDesktop]);

  const handleAsideOutsideClick = useMemo<
    JSX.UIEventHandler<HTMLElement> | undefined
  >(
    () =>
      isAsideVisible
        ? (event) => {
            setMenuVisible(false);
            event.preventDefault();
          }
        : undefined,
    [isAsideVisible],
  );

  return (
    <>
      <Header isVisible={!isScreensaverActive}>
        <StatusBar />
        <Titlebar />
      </Header>
      <Aside
        isVisible={
          (isDesktop && !isScreensaverActive) || Boolean(isAsideVisible)
        }
        ref={menuRef}
      >
        <Menu />
      </Aside>
      {isRoot ? null : (
        <Aside isVisible={false} ref={swipeBackRef}>
          <SwipeBack />
        </Aside>
      )}
      <Main
        isAsideVisible={isScreensaverActive || Boolean(isAsideVisible)}
        onClickCapture={handleAsideOutsideClick}
        ref={mainRef}
        swipeCaptureWidth={swipeCaptureWidth}
      >
        {children}
        <MenuShade active={Boolean(isAsideVisible)} ref={menuShadeRef} />
      </Main>
    </>
  );
};
