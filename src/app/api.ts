import {
  DEFAULT_MATCH_DEPTH,
  Level,
  Match,
  match,
  TExclude,
  TValueType,
  ValueType,
} from '@iot/iot-monolith/tree';
import {
  InteractionReference,
  InteractionType,
} from '@iot/iot-monolith/tree-serialization';
import { SharedWorkerSupported } from '@okikio/sharedworker';
import { computed, ReadonlySignal, signal } from '@preact/signals';
import { Remote, wrap } from 'comlink';
import { createStore, get, UseStore } from 'idb-keyval';

import { API_WORKER_API, TSerialization } from '../common/types.js';
import { id } from './main.js';
import { readOnly } from './util/signal.js';
import { isSafari } from './util/useragent.js';

const WEB_API_UUID = 'c4218bec-e940-4d68-8807-5c43b2aee27b';
const OBSERVE_NOTIFIER = 'c3a428eb-544e-4d11-927d-4aefcd81210c';

export type LevelObject = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  [Level.AREA]: Match<{ level: Level.AREA }, TExclude, TSerialization, 15>;
  [Level.BUILDING]: Match<
    { level: Level.BUILDING },
    TExclude,
    TSerialization,
    15
  >;
  [Level.DEVICE]: Match<{ level: Level.DEVICE }, TExclude, TSerialization, 15>;
  [Level.ELEMENT]: Match<
    { level: Level.ELEMENT },
    TExclude,
    TSerialization,
    15
  >;
  [Level.FLOOR]: Match<{ level: Level.FLOOR }, TExclude, TSerialization, 15>;
  [Level.HOME]: Match<{ level: Level.HOME }, TExclude, TSerialization, 15>;
  [Level.NONE]: Match<{ level: Level.NONE }, TExclude, TSerialization, 15>;
  [Level.PROPERTY]: Match<
    { level: Level.PROPERTY },
    TExclude,
    TSerialization,
    15
  >;
  [Level.ROOM]: Match<{ level: Level.ROOM }, TExclude, TSerialization, 15>;
  [Level.SYSTEM]: Match<{ level: Level.SYSTEM }, TExclude, TSerialization, 15>;
};

export type AnyObject = Match<object, TExclude, TSerialization, 15>;

export class Api {
  private readonly _api: Remote<API_WORKER_API>;
  private _hierarchy?: TSerialization;
  private readonly _notifier: BroadcastChannel;
  private readonly _stateStore = createStore('api_state', 'state');
  private readonly _valuesStore = createStore('api_values', 'values');

  readonly $isInit: ReadonlySignal<boolean>;
  readonly $isWebsocketOnline: ReadonlySignal<boolean>;
  readonly isInit: Promise<void>;

  constructor() {
    const workerName = SharedWorkerSupported && !isSafari ? 'api' : `api_${id}`;

    this._api = wrap(
      SharedWorkerSupported && !isSafari
        ? new SharedWorker(
            new URL(
              '../workers/api.js',
              import.meta.url,
            ) /* webpackChunkName: 'api' */,
            { name: workerName },
          ).port
        : new Worker(
            new URL(
              '../workers/api.js',
              import.meta.url,
            ) /* webpackChunkName: 'api' */,
            { name: workerName },
          ),
    );

    this._notifier = new BroadcastChannel(`${OBSERVE_NOTIFIER}_${workerName}`);

    const { promise, resolve } = Promise.withResolvers<void>();
    this.isInit = promise;

    const $isInit = signal(false);
    this.$isInit = readOnly($isInit);
    promise.then(() => ($isInit.value = true));

    this._setNotifierReaction<TSerialization>(
      'hierarchy',
      (hierarchy) => {
        this._hierarchy = hierarchy;
        resolve();
      },
      this._stateStore,
    );

    const $isWebsocketOnline = signal(false);
    this.$isWebsocketOnline = readOnly($isWebsocketOnline);
    this._setNotifierReaction(
      'online',
      () => ($isWebsocketOnline.value = true),
      this._stateStore,
    );
    this._setNotifierReaction(
      'offline',
      () => ($isWebsocketOnline.value = false),
      this._stateStore,
    );

    this._api.init();
  }

  private async _setNotifierReaction<T>(
    key: string,
    callback: (value: T) => void,
    store?: UseStore,
    abort?: AbortController,
    callbackInit = false,
  ) {
    const handleMessage = async ({ data }: MessageEvent) => {
      if (abort?.signal.aborted) return;
      if (data !== key) return;

      const value = store ? await get(key, store) : undefined;
      callback(value);
    };

    this._notifier.addEventListener('message', handleMessage, {
      signal: abort?.signal,
    });

    if (callbackInit) {
      const value = store ? await get(key, store) : undefined;
      // eslint-disable-next-line callback-return
      callback(value);
    }
  }

  get hierarchy(): TSerialization | undefined {
    return this._hierarchy;
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
        this._setNotifierReaction(
          resolved,
          (value) => ($signal.value = value as T | undefined),
          this._valuesStore,
          abort,
          true,
        );
      });
    }

    return computed(() => $signal.value);
  }

  $typedCollector<
    T extends {
      setState: InteractionReference<string, InteractionType.COLLECT>;
      valueType: ValueType;
    },
  >(object?: T | undefined): (value: TValueType[T['valueType']]) => void {
    return this.$collector(object?.setState.reference);
  }

  $typedEmitter<
    T extends {
      state: InteractionReference<string, InteractionType.EMIT>;
      valueType: ValueType;
    },
  >(
    object?: T | Promise<T> | undefined,
    abort?: AbortController,
  ): ReadonlySignal<TValueType[T['valueType']] | undefined> {
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

  clearStores(): Promise<void> {
    return this._api.clearStores();
  }

  match<
    P extends object,
    E,
    R extends object = TSerialization,
    D extends number = typeof DEFAULT_MATCH_DEPTH,
  >(
    pattern: P,
    exclude: E,
    root = this.hierarchy as R,
    depth = DEFAULT_MATCH_DEPTH as D,
  ): Match<P, E, R, D>[] {
    return match(pattern, exclude, root, depth);
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

  const listedResults = listedResultsCollection.flat();

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
      return [listedResults, unlistedResults].flat();
    },
    listedResults,
    unlistedResults,
  };
};
