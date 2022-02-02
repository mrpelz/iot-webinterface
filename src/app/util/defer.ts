import { useEffect, useRef, useState } from 'preact/hooks';

export const useDefer = <T>(value: T, delay: number): T | null => {
  const [state, setState] = useState<T | null>(null);

  const timeoutRef = useRef<number>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => setState(value), delay);

    const { current: timeout } = timeoutRef;

    return () => {
      if (!timeout) return;
      clearTimeout(timeout);
    };
  }, [delay, value]);

  return state;
};
