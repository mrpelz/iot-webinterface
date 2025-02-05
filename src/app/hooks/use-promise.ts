import { useEffect, useMemo, useRef, useState } from 'preact/hooks';

export const usePromise = <T, F = undefined>(
  input: Promise<T> | T,
  fallback = undefined as F,
): T | F => {
  const [state, setState] = useState<T | F>(() => fallback);

  useEffect(() => {
    (async () => {
      setState(await input);
    })();
  }, [input, setState]);

  return state;
};

export const usePromisify = <T>(input: T | undefined): Promise<T> => {
  // eslint-disable-next-line prettier/prettier
  const promiseResolverRef = useRef<((value: T | PromiseLike<T>) => void) | undefined>(undefined);

  useEffect(() => {
    const { current: promiseResolver } = promiseResolverRef;
    if (!promiseResolver || input === undefined) return;

    promiseResolver(input);
  }, [input]);

  return useMemo(
    () =>
      new Promise<T>(
        (resolve) =>
          (promiseResolverRef.current = (...args) => {
            resolve(...args);
            promiseResolverRef.current = undefined;
          }),
      ),
    [],
  );
};
