import {
  computed,
  effect,
  ReadonlySignal,
  Signal,
  signal,
} from '@preact/signals';

import { $flags } from './flags.js';

export type AnySignal<T> = Signal<T> | ReadonlySignal<T>;

export type TSignal<T extends AnySignal<unknown>> = T['value'];

export enum SignalType {
  SIGNAL,
  READONLY_SIGNAL,
}

export type ValueSignalMap<
  S extends SignalType,
  T extends Record<string, unknown>,
> = {
  [K in keyof T]: S extends SignalType.SIGNAL
    ? Signal<T[K]>
    : ReadonlySignal<T[K]>;
};

export type SignalValueMap<T extends Record<string, AnySignal<unknown>>> = {
  [K in keyof T]: T[K]['value'];
};

export const isSignal = <T>(input: T | AnySignal<T>): input is AnySignal<T> => {
  if (!input) return false;
  if (typeof input !== 'object') return false;
  if (!('brand' in input)) return false;
  if (input.brand !== Symbol.for('preact-signals')) return false;

  return true;
};

export const readOnly = <T>(input: Signal<T>): ReadonlySignal<T> =>
  computed(() => input.value);

export const separatedSignal = <
  S extends SignalType,
  T extends Record<string, unknown>,
>(
  type: S,
  input: T,
): ValueSignalMap<S, T> =>
  Object.fromEntries(
    Object.entries(input).map(([key, value]) => {
      const result = signal(value) as Signal<T[keyof T]>;

      if (type === SignalType.SIGNAL) {
        return [key, result] as const;
      }

      return [key, readOnly(result)] as const;
    }),
  ) as ValueSignalMap<S, T>;

export const combinedSignal = <T extends Record<string, AnySignal<unknown>>>(
  input: T,
): ReadonlySignal<SignalValueMap<T>> =>
  computed(() => {
    let result = {} as SignalValueMap<T>;

    for (const [key, value] of Object.entries(input)) {
      result[key as keyof T] = value.value;
    }

    return result;
  });

export const callback = <
  T extends Record<string, AnySignal<unknown>>,
  A extends unknown[],
  R,
>(
  handler: (inputs: SignalValueMap<T>, ...args: A) => R,
  signals: T,
): ReadonlySignal<(...args: A) => R> => {
  const $combinedInputs = combinedSignal(signals);

  return computed(() => {
    const { value: debug } = $flags.debug;
    const combinedInputs = $combinedInputs.value;

    if (debug) {
      // eslint-disable-next-line no-console
      console.log('signalCallback signal recalculation', combinedInputs);
    }

    return (...args: A) => {
      const result = handler(combinedInputs, ...args);

      if (debug) {
        // eslint-disable-next-line no-console
        console.log(
          'signalCallback callback call',
          combinedInputs,
          args,
          result,
        );
      }

      return result;
    };
  });
};

export const callbackSignal = <
  T extends Record<string, AnySignal<unknown>>,
  A extends unknown[],
  R,
>(
  handler: (inputs: SignalValueMap<T>, ...args: A) => R,
  signals: T,
): ((...args: A) => ReadonlySignal<R>) => {
  // eslint-disable-next-line callback-return
  const result = callback(handler, signals);

  return (...args: A) => computed(() => result.value(...args));
};

export const previous = <T>(
  input: Signal<T> | ReadonlySignal<T>,
): readonly [ReadonlySignal<T | null>, ReadonlySignal<T>] => {
  let inputRef: T | null = null;
  const $previous = signal<T | null>(null);

  effect(() => {
    $previous.value = inputRef;
    inputRef = input.value;
  });

  return [readOnly($previous), readOnly(input)] as const;
};

export const delayedSignal = <T>(
  input: Signal<T> | ReadonlySignal<T>,
  delay: number,
  resetOnDelayStart = false,
): ReadonlySignal<T | null> => {
  const $result = signal<T | null>(input.value);

  effect(() => {
    const { value: newValue } = input;

    if (resetOnDelayStart) {
      $result.value = null;
    }

    const timeout = setTimeout(() => {
      $result.value = newValue;
    }, delay);

    return () => clearTimeout(timeout);
  });

  return computed(() => $result.value);
};

export const persistedSignal = <T extends string = string>(
  identifier: string,
  initialValue?: T | undefined,
): Signal<T | undefined> => {
  const $signal = signal(
    (localStorage.getItem(identifier) as T) ?? initialValue ?? undefined,
  );

  effect(() => {
    const { value } = $signal;
    if (value === undefined) {
      localStorage.removeItem(identifier);
      return;
    }

    localStorage.setItem(identifier, value);
  });

  return $signal;
};

export const promisedSignal = <T>(
  promise: Promise<T>,
): ReadonlySignal<T | undefined> => {
  const $signal = signal<T | undefined>();

  promise.then((result) => {
    $signal.value = result;
  });

  return readOnly($signal);
};
