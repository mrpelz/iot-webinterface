import {
  createContext,
  FunctionComponent,
  RefObject,
  UIEventHandler,
} from 'preact';
import { useContext, useLayoutEffect, useMemo, useRef } from 'preact/hooks';

import { Aside, Header, Main } from '../components/layout.js';
import { MenuShade } from '../components/menu.js';
import { isMenuVisible$, setMenuVisible } from '../state/menu.js';
import { goUp, isRoot$ } from '../state/path.js';
import { isScreensaverActive$ } from '../state/screensaver.js';
import { dimensions } from '../style.js';
import { useBreakpoint } from '../style/breakpoint.js';
import { getMediaQuery } from '../style/main.js';
import { Menu } from './menu.js';
import { StatusBar } from './status-bar.js';
import { SwipeBack } from './swipe-back.js';
import { Titlebar } from './titlebar.js';

export const swipeCaptureWidth = 30;

const MainRefContext = createContext(
  undefined as unknown as RefObject<HTMLElement>,
);

export const useMainRef = (): RefObject<HTMLElement> =>
  useContext(MainRefContext);

export const Layout: FunctionComponent<{ appRef: RefObject<HTMLElement> }> = ({
  appRef,
  children,
}) => {
  const isDesktop = useBreakpoint(getMediaQuery(dimensions.breakpointDesktop));

  const isAsideVisible = isMenuVisible$.value;
  const isScreensaverActive = isScreensaverActive$.value;

  const menuRef = useRef<HTMLElement>(null);
  const menuShadeRef = useRef<HTMLDivElement>(null);

  const swipeBackRef = useRef<HTMLElement>(null);

  const mainRef = useRef<HTMLElement>(null);

  const isRoot = isRoot$.value;

  useLayoutEffect(() => {
    const { current: mainCurrent } = appRef;

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
      if (isMenuVisible$.value) return;
      if (isMenuVisible$.value === null && isRoot$.value) return;

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

      if (!lastX || isMenuVisible$.value) return;

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

      if (!lastX || isMenuVisible$.value) return;

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
      if (!lastX || isMenuVisible$.value) return;

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
  }, [appRef]);

  useLayoutEffect(() => {
    if (!menuRef.current) return;

    const { style } = menuRef.current;
    style.transform = '';
  }, [isDesktop]);

  const handleAsideOutsideClick = useMemo<
    UIEventHandler<HTMLElement> | undefined
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
        ref={menuRef}
        isVisible={
          (isDesktop && !isScreensaverActive) || Boolean(isAsideVisible)
        }
      >
        <Menu />
      </Aside>
      {isRoot ? null : (
        <Aside
          ref={swipeBackRef}
          isVisible={false}
        >
          <SwipeBack />
        </Aside>
      )}
      <Main
        ref={mainRef}
        isAsideVisible={isScreensaverActive || Boolean(isAsideVisible)}
        onClickCapture={handleAsideOutsideClick}
      >
        <MainRefContext.Provider value={mainRef}>
          {children}
        </MainRefContext.Provider>
        <MenuShade
          ref={menuShadeRef}
          active={Boolean(isAsideVisible)}
        />
      </Main>
    </>
  );
};
