import { MutableRef, useEffect } from 'preact/hooks';

export type SwipeDirection = 'horizontal' | 'vertial';

export const useSwipe = <T extends HTMLElement>(
  ref: MutableRef<T | undefined>,
  setter: (input: number | undefined) => void,
  throttle: number,
  direction: SwipeDirection = 'horizontal',
): void => {
  useEffect(() => {
    const { current: element } = ref;
    if (!element) return undefined;

    const { offsetHeight, offsetWidth } = element;
    const size = direction === 'horizontal' ? offsetWidth : offsetHeight;

    let update = 0;

    let startMainAxis: number | undefined;
    let startCrossAxis: number | undefined;
    let lock = false;

    const onTouchStart: (
      this: HTMLElement,
      event: HTMLElementEventMap['touchstart'],
    ) => void = ({ targetTouches }) => {
      const touch = targetTouches.item(0);
      if (!touch) return;
      if (startMainAxis !== undefined || startCrossAxis !== undefined) return;

      const x = touch.clientX;
      const y = touch.clientY;

      startMainAxis = direction === 'horizontal' ? x : y;
      startCrossAxis = direction === 'horizontal' ? y : x;

      update = Date.now();

      setter(0);
    };

    const onTouchMove: (
      this: HTMLElement,
      event: HTMLElementEventMap['touchmove'],
    ) => void = (event) => {
      const { targetTouches } = event;

      const touch = targetTouches.item(0);
      if (!touch) return;
      if (startMainAxis === undefined || startCrossAxis === undefined) return;

      const x = touch.clientX;
      const y = touch.clientY;

      const mainAxis = direction === 'horizontal' ? x : y;
      const crossAxis = direction === 'horizontal' ? y : x;

      const mainDelta = mainAxis - startMainAxis;
      const crossDelta = crossAxis - startCrossAxis;

      if (!lock && mainDelta > 10) {
        lock = true;
      }

      if (Math.abs(crossDelta) > Math.abs(mainDelta) && !lock) {
        startMainAxis = undefined;
        startCrossAxis = undefined;

        return;
      }

      event.preventDefault();

      const now = Date.now();
      const timeSinceUpdate = now - update;

      if (timeSinceUpdate < throttle) return;
      update = now;

      const diff = mainDelta / size;

      setter(diff);
    };

    const onTouchEnd: (
      this: HTMLElement,
      event:
        | HTMLElementEventMap['touchend']
        | HTMLElementEventMap['touchcancel'],
    ) => void = () => {
      update = 0;

      startMainAxis = undefined;
      startCrossAxis = undefined;

      lock = false;

      setter(undefined);
    };

    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchmove', onTouchMove, { passive: false });
    element.addEventListener('touchend', onTouchEnd, { passive: true });
    element.addEventListener('touchcancel', onTouchEnd, {
      passive: true,
    });

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
      element.removeEventListener('touchcancel', onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction, setter]);
};
