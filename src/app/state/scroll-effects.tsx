import { useLayoutEffect, useRef } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import { useHookDebug } from '../hooks/use-hook-debug.js';
import { useIsMenuVisible } from './menu.js';
import { useIsScreensaverActive } from './screensaver.js';
import { useSegment } from './path.js';

export const ScrollEffects: FunctionComponent = () => {
  useHookDebug('Scroll');

  const isMenuVisible = useIsMenuVisible();
  const isScreensaverActive = useIsScreensaverActive();

  const isScrollLocked = Boolean(isMenuVisible) || isScreensaverActive;
  const isScrollLockedRef = useRef<boolean>(isScrollLocked);

  const [path] = useSegment(0);
  const previousPath = useRef<string | null>(null);

  const previousScrollY = useRef(0);

  useLayoutEffect(() => {
    isScrollLockedRef.current = isScrollLocked;
  }, [isScrollLocked]);

  useLayoutEffect(() => {
    const { style } = document.documentElement;

    requestAnimationFrame(() => {
      if (isScrollLocked) {
        previousScrollY.current = scrollY;
      }

      style.overflowY = isScrollLocked ? 'hidden' : '';

      scrollTo({
        behavior: 'instant' as ScrollBehavior,
        top:
          !isScrollLocked && previousPath.current !== path
            ? 0
            : previousScrollY.current,
      });

      if (!isScrollLocked) {
        previousPath.current = path;
        previousScrollY.current = 0;
      }
    });
  }, [isScrollLocked, path]);

  useLayoutEffect(() => {
    const onScroll: (
      this: HTMLElement,
      event: HTMLElementEventMap['scroll']
    ) => void = () => {
      if (!isScrollLockedRef.current) return;

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
