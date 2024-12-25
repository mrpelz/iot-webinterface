/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import { usePromise, usePromisify } from '../hooks/use-promise.js';
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
    [Promise<T['reference']>],
    ReadonlySignal<unknown>,
    typeof api.$emitter
  >(
    useCallback((...args) => api.$emitter(...args), []),
    [usePromisify(object?.reference)],
  );

export const useIsInit = (): boolean =>
  usePromise(() => api.isInit.then(() => true)) ?? false;

export const useKey = (object: object): string | undefined => {
  const isInit = useIsInit();

  return useMemo(
    () => (isInit ? api.keys?.getKey(object) : undefined),
    [isInit, object],
  );
};

// @ts-ignore
export const useMatch = <
  P extends object,
  R extends object = TSerialization,
  D extends number = typeof DEFAULT_MATCH_DEPTH,
>(
  pattern: P,
  root?: R,
  depth = DEFAULT_MATCH_DEPTH as D,
): Match<P, R, D>[] => {
  const isInit = useIsInit();

  return useArray(
    useMemo(
      () => (isInit ? api.match(pattern, root, depth) : []),
      [depth, isInit, pattern, root],
    ),
  );
};

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
      object extends undefined
        ? undefined
        : Promise<Exclude<typeof object, undefined>>,
    ],
    ReadonlySignal<TValueType[T] | undefined>,
    typeof api.$typedEmitter
  >(
    useCallback((...args) => api.$typedEmitter(...args), []),
    [usePromisify(object)],
  );

export const useWebSocketCount = (): ReadonlySignal<number | undefined> =>
  useAbortableSignalFactory(
    useCallback((...args) => api.$webSocketCount(...args), []),
  );
