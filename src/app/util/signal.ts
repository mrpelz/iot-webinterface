import { computed, ReadonlySignal, Signal } from '@preact/signals';

export type AnySignal<T> = Signal<T> | ReadonlySignal<T>;

export const readOnly = <T>(signal: Signal<T>): ReadonlySignal<T> =>
  computed(() => signal.value);

export type SignalValueMap<T extends Record<string, AnySignal<unknown>>> = {
  [K in keyof T]: T[K]['value'];
};

export const combinedSignal = <T extends Record<string, AnySignal<unknown>>>(
  input: T,
): ReadonlySignal<SignalValueMap<T>> =>
  computed(() => {
    let result = {} as SignalValueMap<T>;

    for (const [key, signal] of Object.entries(input)) {
      result[key as keyof T] = signal.value;
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
    const { value: combinedInputs } = $combinedInputs;

    return (...args: A) => handler(combinedInputs, ...args);
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

export const callbackUnwrapped = <
  T extends Record<string, AnySignal<unknown>>,
  A extends unknown[],
  R,
>(
  handler: (inputs: SignalValueMap<T>, ...args: A) => R,
  signals: T,
): ((...args: A) => R) => {
  // eslint-disable-next-line callback-return
  const result = callback(handler, signals);

  return (...args: A) => result.value(...args);
};
