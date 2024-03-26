import { effect, ReadonlySignal, Signal, signal } from '@preact/signals';

import { readOnly } from '../util/signal.js';

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
