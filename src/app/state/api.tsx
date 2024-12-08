import { TValueType, ValueType } from '@iot/iot-monolith/tree';
import {
  InteractionReference,
  InteractionType,
} from '@iot/iot-monolith/tree-serialization';
import { ReadonlySignal } from '@preact/signals';
import { useCallback, useMemo } from 'preact/hooks';

import { useAbortableSignalFactory } from '../hooks/use-signal.js';
import { api } from '../main.js';

export const useIsWebSocketOnline = (): ReadonlySignal<boolean> =>
  useAbortableSignalFactory(
    useCallback((...args) => api.$isWebSocketOnline(...args), []),
  );

export const useTypedCollector = <
  R extends string,
  S extends InteractionReference<R, InteractionType.COLLECT>,
  T extends ValueType,
>(object: {
  setState: S;
  valueType: T;
}): ((value: TValueType[T]) => void) =>
  useMemo(() => api.$typedCollector(object), [object]);

export const useTypedEmitter = <
  R extends string,
  S extends InteractionReference<R, InteractionType.EMIT>,
  T extends ValueType,
>(object: {
  state: S;
  valueType: T;
}): ReadonlySignal<TValueType[T] | undefined> =>
  useAbortableSignalFactory<
    [
      {
        state: S;
        valueType: T;
      },
    ],
    ReadonlySignal<TValueType[T] | undefined>,
    typeof api.$typedEmitter
  >(
    useCallback((...args) => api.$typedEmitter(...args), []),
    [object] as const,
  );
