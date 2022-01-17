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
import { Titlebar } from './titlebar.js';
import { dimensions } from '../style.js';
import { useBreakpoint } from '../style/breakpoint.js';
import { useMediaQuery } from '../style/main.js';
import { useNotification } from '../state/notification.js';

export const Layout: FunctionComponent = ({ children }) => {
  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpoint));

  const isAsideVisible = useIsMenuVisible();
  const setAsideVisible = useSetMenuVisible();

  const fallbackNotification = useNotification();
  const hasNotification = Boolean(fallbackNotification);

  const asideRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const isAsideVisibleRef = useRef<MenuVisible>(isAsideVisible);

  useLayoutEffect(() => {
    isAsideVisibleRef.current = isAsideVisible;
  }, [isAsideVisible]);

  useLayoutEffect(() => {
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
      const { targetTouches } = event;

      if (!lastX || isAsideVisibleRef.current) return;

      const x = targetTouches.item(0)?.pageX || 0;

      if (!x) return;
      if (x > asideCurrent.offsetWidth) return;

      event.preventDefault();
      setTransform(x);
    };

    const onTouchEnd: (
      this: HTMLElement,
      event: HTMLElementEventMap['touchend']
    ) => void = () => {
      if (!lastX || isAsideVisibleRef.current) return;

      if (lastX > asideCurrent.offsetWidth / 3) {
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
  }, [asideRef, mainRef]);

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
        isVisible={isAsideVisible}
        shiftDown={hasNotification}
        ref={asideRef}
      >
        <Menu />
      </Aside>
      <Main
        isAsideVisible={isAsideVisible}
        shiftDown={hasNotification}
        ref={mainRef}
        onClickCapture={handleAsideOutsideClick}
      >
        {children}
      </Main>
    </>
  );
};
