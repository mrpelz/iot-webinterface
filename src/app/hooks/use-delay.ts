import { useEffect, useRef, useState } from 'preact/hooks';

export const useDelay = <T>(
  value: T,
  delay: number,
  resetOnDelayStart = false,
): T | null => {
  const [state, setState] = useState<T | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (resetOnDelayStart) {
      setState(null);
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
