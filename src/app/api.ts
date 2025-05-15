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
import { computed, ReadonlySignal, Signal, signal } from '@preact/signals';
import { Remote, wrap } from 'comlink';

import { API_WORKER_API, TSerialization } from '../common/types.js';
import { readOnly } from './util/signal.js';

const WEB_API_UUID = 'c4218bec-e940-4d68-8807-5c43b2aee27b';
const WEB_API_ONLINE = '562a3aa9-a10e-4347-aa3f-cec9e011a3dc';

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
  private static async _getBroadcastChannel<T>(
    $signal: Signal<T>,
    reference: string | Promise<string>,
    abort?: AbortController,
  ) {
    const handleMessage = ({ data }: MessageEvent): void => {
      if (abort?.signal.aborted) return;
      $signal.value = data;
    };

    const reference_ = await reference;

    const channel = new BroadcastChannel(reference_);

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

  readonly $isInit: ReadonlySignal<boolean>;
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

    const $isInit = signal(false);

    this.isInit = (async () => {
      await this._api.isInit;
      this._hierarchy = await this._api.hierarchy;
      Object.freeze(this._hierarchy);

      // eslint-disable-next-line no-console
      console.log(this._hierarchy);
    })();

    this.$isInit = readOnly($isInit);
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
