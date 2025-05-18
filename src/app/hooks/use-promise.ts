import { useEffect, useMemo, useState } from 'preact/hooks';

import { useRerender as useSingleton } from './use-rerender.js';

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

/**
 * Transform reactive value to Promise in order to use “hookable” values outside render tree/components
 * @param input reactive (hookable) value of type `T | undefined`
 * @returns Promise resolving as soon as `input` _excludes_ `undefined`
 */
export const usePromisify = <T>(input: T | undefined): Promise<T> => {
  // create stable singleton reference to explicitly mutate
  const [symbol, trigger] = useSingleton('usePromisify');

  // mutate singleton when `input` changes its value but only if not `undefined`
  useEffect(() => {
    if (input === undefined) return;

    trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  // produce new `PromiseWithResolvers` to resolve once again only on singleton mutation,
  // otherwise keep using still unresolved Promise
  const { promise, resolve } = useMemo(
    () => Promise.withResolvers<T>(),
    /**
     * Once a Promise is resolved to a certain value, this value cannot change.
     * Because the hook implementation previously assumed that the existing Promise instance was reusable,
     * it called the already resolved Promise’s `resolve` method whenever a reactive value change was detected.
     * This is how the change got “lost”.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [symbol],
  );

  // resolve Promise with value once no longer `undefined`
  useEffect(() => {
    if (input === undefined) return;

    resolve(input);
  }, [input, resolve]);

  return promise;
};
