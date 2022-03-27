import { MenuVisible, useIsMenuVisible } from './menu.js';
import { useLayoutEffect, useRef } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import { useHookDebug } from '../util/use-hook-debug.js';
import { useSegment } from './path.js';

export const ScrollEffects: FunctionComponent = () => {
  useHookDebug('Scroll');

  const isMenuVisible = useIsMenuVisible();
  const isMenuVisibleRef = useRef<MenuVisible>(isMenuVisible);

  const [path] = useSegment(0);
  const previousPath = useRef<string | null>(null);

  const previousScrollY = useRef(0);

  useLayoutEffect(() => {
    isMenuVisibleRef.current = isMenuVisible;
  }, [isMenuVisible]);

  useLayoutEffect(() => {
    const { style } = document.documentElement;

    if (isMenuVisible) {
      previousScrollY.current = scrollY;
    }

    style.overflowY = isMenuVisible ? 'hidden' : '';

    scrollTo({
      behavior: 'instant' as ScrollBehavior,
      top:
        !isMenuVisible && previousPath.current !== path
          ? 0
          : previousScrollY.current,
    });

    if (!isMenuVisible) {
      previousPath.current = path;
      previousScrollY.current = 0;
    }
  }, [isMenuVisible, path]);

  useLayoutEffect(() => {
    const onScroll: (
      this: HTMLElement,
      event: HTMLElementEventMap['scroll']
    ) => void = () => {
      if (!isMenuVisibleRef.current) return;

      scrollTo({
        behavior: 'instant' as ScrollBehavior,
        top: previousScrollY.current,
      });
    };

    document.addEventListener('scroll', onScroll);

    return () => {
      document.removeEventListener('scroll', onScroll);
    };
  }, []);

  useLayoutEffect(() => {
    const { style } = document.documentElement;

    return () => {
      style.overflowY = '';
    };
  }, []);

  return null;
};
