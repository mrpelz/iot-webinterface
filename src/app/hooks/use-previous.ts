import { useEffect, useMemo, useRef, useState } from 'preact/hooks';

export const usePrevious = <T>(input: T): readonly [T | null, T] => {
  const inputRef = useRef<T | null>(null);
  const [previous, setPrevious] = useState<T | null>(null);

  useEffect(() => {
    setPrevious(inputRef.current);
    inputRef.current = input;
  }, [input]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => [previous, input] as const, [previous]);
};
