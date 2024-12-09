import { useEffect, useRef, useState } from 'preact/hooks';

export const useDelay = <T>(
  value: T,
  delay: number,
  resetOnDelayStart = false,
): T | undefined => {
  const [state, setState] = useState<T | undefined>(undefined);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    if (resetOnDelayStart) {
      setState(undefined);
    }

    timeoutRef.current = setTimeout(() => setState(value), delay);

    const { current: timeout } = timeoutRef;

    return () => {
      if (!timeout) return;
      clearTimeout(timeout);
    };
  }, [delay, resetOnDelayStart, value]);

  return state;
};
