import { Signal } from '@preact/signals';
import { useEffect, useMemo } from 'preact/hooks';

import { useArray } from './use-array-compare.js';
import { useHookDebug } from './use-hook-debug.js';

/**
 * memoizes signal creation by factory function
 * @param factory factory function that returns a Signal
 * @param args args for factory function
 * @returns returns memoized Signal
 */
export const useSignalFactory = <
  Args,
  Return extends Signal,
  Factory extends (...args: Args[]) => Return,
>(
  factory: Factory,
  args = [] as Args[],
): Return => {
  useHookDebug('useSignalFactory');

  const args_ = useArray(args);

  return useMemo(() => factory(...args_), [args_, factory]);
};

/**
 * memoizes signal creation by factory function
 * creates abort controller, hands it to factory function and signal abort on unmount
 * @param abortableFactory factory function that returns a Signal and takes an abort controller as last arg
 * @param args args for factory function, excluding last one
 * @returns returns memoized Signal
 */
export const useAbortableSignalFactory = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Args extends any[],
  Return extends Signal,
  AbortableFactory extends (
    ...args: [...Args, AbortController | undefined]
  ) => Return,
>(
  abortableFactory: AbortableFactory,
  args = [] as unknown as Args,
): Return => {
  useHookDebug('useAbortableSignalFactory');

  const abortController = useMemo(() => new AbortController(), []);
  useEffect(() => () => abortController.abort(), [abortController]);

  return useSignalFactory(
    abortableFactory,
    useArray([...args, abortController] as const),
  );
};
