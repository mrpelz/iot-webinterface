import { Aside, Header, Main } from '../components/layout.js';
import { FunctionComponent, JSX } from 'preact';
import {
  MenuVisible,
  useIsMenuVisible,
  useSetMenuVisible,
} from '../state/menu.js';
import { useLayoutEffect, useMemo, useRef } from 'preact/hooks';
import { Menu } from './menu.js';
import { Notification } from './notification.js';
import { StatusBar } from './status-bar.js';
import { SwipeBack } from './swipe-back.js';
import { Titlebar } from './titlebar.js';
import { dimensions } from '../style.js';
import { useBreakpoint } from '../style/breakpoint.js';
import { useGoUp } from '../state/path.js';
import { useMediaQuery } from '../style/main.js';

export const Layout: FunctionComponent = ({ children }) => {
  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpointDesktop));

  const isAsideVisible = useIsMenuVisible();
  const setAsideVisible = useSetMenuVisible();

  const goUp = useGoUp();

  const asideRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const isAsideVisibleRef = useRef<MenuVisible>(null);
  const isGoUpActiveRef = useRef<typeof goUp>(null);

  useLayoutEffect(() => {
    isAsideVisibleRef.current = isAsideVisible;
  }, [isAsideVisible]);

  useLayoutEffect(() => {
    isGoUpActiveRef.current = goUp;
  }, [goUp]);

  useLayoutEffect(() => {
    const { current: mainCurrent } = mainRef;

    if (!mainCurrent || !asideRef.current) return undefined;

    let lastX = 0;

    const setTransform = (input: number) => {
      if (!asideRef.current) return;

      lastX = input;

      const { style } = asideRef.current;

      style.transition = input ? 'none' : '';
      style.touchAction = input ? 'pan-x' : '';

      style.transform = input
        ? `translate3d(calc(-100% + ${input}px), 0, 0)`
        : '';
    };

    const onTouchStart: (
      this: HTMLElement,
      event: HTMLElementEventMap['touchstart']
    ) => void = ({ targetTouches }) => {
      if (isAsideVisibleRef.current) return;

      const x = targetTouches.item(0)?.pageX || 0;

      if (!x) return;
      if (x > 20) return;

      setTransform(x);
    };

    const onTouchMove: (
      this: HTMLElement,
      event: HTMLElementEventMap['touchmove']
    ) => void = (event) => {
      if (!asideRef.current) return;

      const { targetTouches } = event;

      if (!lastX || isAsideVisibleRef.current) return;

      const x = targetTouches.item(0)?.pageX || 0;

      if (!x) return;
      if (x > asideRef.current.offsetWidth) return;

      event.preventDefault();
      setTransform(x);
    };

    const onTouchEnd: (
      this: HTMLElement,
      event: HTMLElementEventMap['touchend']
    ) => void = () => {
      if (!asideRef.current) return;

      if (!lastX || isAsideVisibleRef.current) return;

      if (isGoUpActiveRef.current) {
        if (lastX > asideRef.current.offsetWidth / 2) {
          isGoUpActiveRef.current?.();
        }
      } else if (lastX > asideRef.current.offsetWidth / 3) {
        setAsideVisible(true);
      }

      setTransform(0);
    };

    const onTouchCancel: (
      this: HTMLElement,
      event: HTMLElementEventMap['touchcancel']
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
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
  }, [isAsideVisible, setAsideVisible]);

  return (
    <>
      <Header>
        <StatusBar />
        <Titlebar />
        <Notification />
      </Header>
      <Aside
        isVisible={isDesktop || Boolean(isAsideVisible)}
        ref={goUp ? undefined : asideRef}
      >
        <Menu />
      </Aside>
      <Aside isVisible={false} ref={goUp ? asideRef : undefined}>
        <SwipeBack />
      </Aside>
      <Main
        isAsideVisible={Boolean(isAsideVisible)}
        ref={mainRef}
        onClickCapture={handleAsideOutsideClick}
      >
        {children}
      </Main>
    </>
  );
};
