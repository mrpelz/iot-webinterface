import { useEffect, useState } from 'preact/hooks';

export const useDelay = <T>(
  value: T,
  delay: number,
  resetOnDelayStart = false,
): T | undefined => {
  const [state, setState] = useState<T | undefined>(undefined);

  useEffect(() => {
    if (resetOnDelayStart) {
      setState(undefined);
    }

    const timeout = setTimeout(() => setState(value), delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [delay, resetOnDelayStart, value]);

  return state;
};
