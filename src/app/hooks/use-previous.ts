import { useEffect, useMemo, useRef, useState } from 'preact/hooks';

export const usePrevious = <T>(input: T): readonly [T | undefined, T] => {
  const inputRef = useRef<T | undefined>(undefined);
  const [previous, setPrevious] = useState<T | undefined>(undefined);

  useEffect(() => {
    setPrevious(inputRef.current);
    inputRef.current = input;
  }, [input]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => [previous, input] as const, [previous]);
};
