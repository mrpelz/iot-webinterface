import {
  DEFAULT_MATCH_DEPTH,
  Match,
  TValueType,
  ValueType,
} from '@iot/iot-monolith/tree';
import {
  InteractionReference,
  InteractionType,
} from '@iot/iot-monolith/tree-serialization';
import { ReadonlySignal } from '@preact/signals';
import { useCallback, useMemo } from 'preact/hooks';

import { TSerialization } from '../../common/types.js';
import { useArray } from '../hooks/use-array-compare.js';
import { usePromise } from '../hooks/use-promise.js';
import { useAbortableSignalFactory } from '../hooks/use-signal.js';
import { api } from '../main.js';

export const useCollector = <
  T extends InteractionReference<string, InteractionType.COLLECT>,
>(
  object?: T | undefined,
): ((value: unknown) => void) =>
  useMemo(() => api.$collector(object?.reference), [object]);

export const useEmitter = <
  T extends InteractionReference<string, InteractionType.EMIT>,
>(
  object?: T | undefined,
): ReadonlySignal<unknown> =>
  useAbortableSignalFactory<
    [string],
    ReadonlySignal<unknown>,
    typeof api.$emitter
  >(
    useCallback((...args) => api.$emitter(...args), []),
    [object?.reference as Exclude<T['reference'], undefined>],
  );

export const useMatch = <
  P extends object,
  R extends object = TSerialization,
  D extends number = typeof DEFAULT_MATCH_DEPTH,
>(
  pattern: P,
  root?: R,
  depth = DEFAULT_MATCH_DEPTH as D,
): Match<P, R, D>[] =>
  useArray(
    useMemo(() => api.match(pattern, root, depth), [depth, pattern, root]),
  );

export const useIsInit = (): boolean =>
  usePromise(() => api.isInit.then(() => true)) ?? false;

export const useIsWebSocketOnline = (): ReadonlySignal<boolean> =>
  useAbortableSignalFactory(
    useCallback((...args) => api.$isWebSocketOnline(...args), []),
  );

export const useTypedCollector = <
  R extends string,
  S extends InteractionReference<R, InteractionType.COLLECT>,
  T extends ValueType,
>(object?: {
  setState: S;
  valueType: T;
}): ((value: TValueType[T]) => void) =>
  useMemo(() => api.$typedCollector(object), [object]);

export const useTypedEmitter = <
  R extends string,
  S extends InteractionReference<R, InteractionType.EMIT>,
  T extends ValueType,
>(
  object?:
    | {
        state: S;
        valueType: T;
      }
    | undefined,
): ReadonlySignal<TValueType[T] | undefined> =>
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
    [object as Exclude<typeof object, undefined>],
  );

export const useWebSocketCount = (): ReadonlySignal<number | undefined> =>
  useAbortableSignalFactory(
    useCallback((...args) => api.$webSocketCount(...args), []),
  );
