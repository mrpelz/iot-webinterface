/* eslint-disable @typescript-eslint/ban-ts-comment */
import { isPlainObject, objectKeys, objectValues } from '@iot/iot-monolith/oop';
import {
  DEFAULT_MATCH_DEPTH,
  Level,
  Match,
  match,
  TValueType,
  ValueType,
} from '@iot/iot-monolith/tree';
import {
  InteractionReference,
  InteractionType,
} from '@iot/iot-monolith/tree-serialization';
import { computed, ReadonlySignal, Signal, signal } from '@preact/signals';
import { Remote, wrap } from 'comlink';

import { API_WORKER_API, TSerialization } from '../common/types.js';

const WEB_API_UUID = 'c4218bec-e940-4d68-8807-5c43b2aee27b';
const WEB_API_ONLINE = '562a3aa9-a10e-4347-aa3f-cec9e011a3dc';

export type LevelObject = {
  // @ts-ignore
  [Level.AREA]: Match<{ level: Level.AREA }, TSerialization>;
  [Level.BUILDING]: Match<{ level: Level.BUILDING }, TSerialization>;
  [Level.DEVICE]: Match<{ level: Level.DEVICE }, TSerialization>;
  [Level.ELEMENT]: Match<{ level: Level.ELEMENT }, TSerialization>;
  [Level.FLOOR]: Match<{ level: Level.FLOOR }, TSerialization>;
  [Level.HOME]: Match<{ level: Level.HOME }, TSerialization>;
  [Level.NONE]: Match<{ level: Level.NONE }, TSerialization>;
  [Level.PROPERTY]: Match<{ level: Level.PROPERTY }, TSerialization>;
  [Level.ROOM]: Match<{ level: Level.ROOM }, TSerialization>;
  [Level.SYSTEM]: Match<{ level: Level.SYSTEM }, TSerialization>;
};

class Keys {
  private readonly _keys = new WeakMap<Record<string, unknown>, string[]>();
  constructor(object: Record<string, unknown>) {
    this._addChildren(object);
  }

  private _addChildren(object: Record<string, unknown>) {
    for (const key of objectKeys(object)) {
      const child = object[key] as Record<string, unknown>;

      if (!isPlainObject(child)) continue;

      const existingKeys = this.getKey(child);
      existingKeys.push(key);

      this._keys.set(child, existingKeys);
      this._addChildren(child);
    }
  }

  getKey(object: Record<string, unknown>): string[] {
    return this._keys.get(object) ?? [];
  }
}

export class Parents {
  private readonly _parents = new WeakMap<object, Set<object>>();
  constructor(object: object) {
    this._addChildren(object, undefined);
  }

  private _addChildren(object: object, parent?: object) {
    let parents = this._parents.get(object);
    if (parents) {
      if (parent) parents.add(parent);
    } else {
      parents = new Set<object>(parent ? [parent] : undefined);
      this._parents.set(object, parents);
    }

    for (const child of objectValues(object)) {
      if (!isPlainObject(child)) continue;
      this._addChildren(child, object);
    }
  }

  getParents(object: object): Set<object> | undefined {
    return this._parents.get(object);
  }
}

export class Api {
  private static async _getBroadcastChannel<T>(
    $signal: Signal<T>,
    reference: string | Promise<string>,
    abort?: AbortController,
  ) {
    const handleMessage = ({ data }: MessageEvent): void => {
      if (abort?.signal.aborted) return;
      $signal.value = data;
    };

    const channel = new BroadcastChannel(await reference);

    channel.addEventListener('message', handleMessage);

    abort?.signal.addEventListener(
      'abort',
      () => {
        channel.removeEventListener('message', handleMessage);
        channel.close();
      },
      { once: true },
    );
  }

  private readonly _api: Remote<API_WORKER_API>;
  private _hierarchy?: TSerialization;
  private _keys?: Keys;
  private _parents?: Parents;

  readonly isInit: Promise<void>;

  constructor() {
    this._api = wrap(
      new SharedWorker(
        new URL(
          '../workers/api.js',
          import.meta.url,
        ) /* webpackChunkName: 'api' */,
        { name: 'api' },
      ).port,
    );

    this.isInit = (async () => {
      await this._api.isInit;
      // @ts-ignore
      this._hierarchy = await this._api.hierarchy;
      this._keys = new Keys(this._hierarchy);
      this._parents = new Parents(this._hierarchy);

      // eslint-disable-next-line no-console
      console.log(this._hierarchy);
    })();
  }

  get hierarchy(): TSerialization | undefined {
    return this._hierarchy;
  }

  get keys(): Keys | undefined {
    return this._keys;
  }

  get parents(): Parents | undefined {
    return this._parents;
  }

  $collector<T>(reference?: string): (value: T) => void {
    return (value) => {
      if (!reference) return;

      this._api.triggerCollector(reference, value);
    };
  }

  $emitter<T>(
    reference?: string | Promise<string>,
    abort?: AbortController,
  ): ReadonlySignal<T | undefined> {
    const reference_ = reference ? Promise.resolve(reference) : undefined;
    const $signal = signal<T | undefined>(undefined);

    if (reference_) {
      reference_.then((resolved) => {
        this._api
          .getValue(resolved)
          .catch(() => undefined)
          .then((value) => ($signal.value = value as T | undefined));
      });

      Api._getBroadcastChannel($signal, reference_, abort);
    }

    return computed(() => $signal.value);
  }

  $isWebSocketOnline(abort?: AbortController): ReadonlySignal<boolean> {
    const $signal = signal<boolean | undefined>(undefined);

    this._api
      .isOnline()
      .catch(() => undefined)
      .then((value) => ($signal.value = value));

    Api._getBroadcastChannel($signal, WEB_API_ONLINE, abort);

    return computed(() => $signal.value ?? false);
  }

  $typedCollector<
    R extends string,
    S extends InteractionReference<R, InteractionType.COLLECT>,
    T extends ValueType,
  >(
    object?: { setState: S; valueType: T } | undefined,
  ): (value: TValueType[T]) => void {
    return this.$collector(object?.setState.reference);
  }

  $typedEmitter<
    R extends string,
    S extends InteractionReference<R, InteractionType.EMIT>,
    T extends ValueType,
    O extends {
      state: S;
      valueType: T;
    },
  >(
    object?: O | Promise<O> | undefined,
    abort?: AbortController,
  ): ReadonlySignal<TValueType[T] | undefined> {
    return this.$emitter(
      (object ? Promise.resolve(object) : undefined)?.then(
        (resolved) => resolved.state.reference,
      ),
      abort,
    );
  }

  $webSocketCount(abort?: AbortController): ReadonlySignal<number | undefined> {
    return this.$emitter(WEB_API_UUID, abort);
  }

  match<
    P extends object,
    R extends object = TSerialization,
    D extends number = typeof DEFAULT_MATCH_DEPTH,
  >(
    pattern: P,
    root = this.hierarchy as R,
    depth = DEFAULT_MATCH_DEPTH as D,
  ): Match<P, R, D>[] {
    return match(pattern, root, depth);
  }
}

type GroupByResult<T extends object, K extends keyof Required<T>> = {
  elements: T[];
  group: T[K];
}[];

export const groupBy = <T extends object, K extends keyof Required<T>>(
  input: readonly T[],
  property: K,
): GroupByResult<T, K> => {
  const keys = new Set<T[K]>();

  for (const object of input) {
    keys.add(object[property]);
  }

  const result: GroupByResult<T, K> = [];

  for (const key of keys) {
    result.push({
      elements: input.filter(
        (object) => property in object && object[property] === key,
      ),
      group: key,
    });
  }

  return result;
};

export const sortBy = <T extends object, K extends keyof Required<T>>(
  input: readonly T[],
  property: K,
  list: readonly T[K][],
): Record<'all' | 'listedResults' | 'unlistedResults', T[]> => {
  const listedResultsCollection: T[][] = [];

  for (const listItem of list) {
    const matchingObject = input.filter(
      (object) => property in object && object[property] === listItem,
    );
    if (match.length === 0) continue;

    listedResultsCollection.push(matchingObject);
  }

  const listedResults = listedResultsCollection.flat(1);

  const unlistedResults: T[] = [];

  for (const object of input) {
    if (!(property in object)) continue;

    const value = object[property];
    if (!value) continue;
    if (list.includes(value)) continue;

    unlistedResults.push(object);
  }

  return {
    get all() {
      return [listedResults, unlistedResults].flat(1);
    },
    listedResults,
    unlistedResults,
  };
};
