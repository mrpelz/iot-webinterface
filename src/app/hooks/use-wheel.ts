import { MutableRef, useCallback, useEffect, useRef } from 'preact/hooks';

export type WheelDirection = 'both' | 'horizontal' | 'vertial';

export const useWheel = <T extends HTMLElement>(
  ref: MutableRef<T | null>,
  setter: (input: number) => void,
  throttle: number,
  direction: WheelDirection = 'both',
): void => {
  const updateRef = useRef(0);

  const onWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();

      const now = Date.now();
      const timeSinceUpdate = now - updateRef.current;

      if (timeSinceUpdate < throttle) return;
      updateRef.current = now;

      const { deltaX, deltaY } = event;

      if (direction === 'horizontal') {
        setter(deltaX);
        return;
      }

      if (direction === 'vertial') {
        setter(-deltaY);
        return;
      }

      const useX = Math.abs(deltaX) > Math.abs(deltaY);

      setter(useX ? deltaX : -deltaY);
    },
    [direction, setter, throttle],
  );

  useEffect(() => {
    const { current: element } = ref;
    if (!element) return undefined;

    element.addEventListener('wheel', onWheel);

    return () => element.removeEventListener('wheel', onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onWheel]);
};
