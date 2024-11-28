/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
  DeepValuesInclusive,
  objectKeys,
  objectValues,
  Prev,
} from '@iot/iot-monolith/oop';
import { TValueType, ValueType } from '@iot/iot-monolith/tree';
import { computed, ReadonlySignal, Signal, signal } from '@preact/signals';
import { Remote, wrap } from 'comlink';

import { API_WORKER_API, TSerialization } from '../common/types.js';
import { isObject } from './util/oop.js';

const INTERACTION_UUID_NAMESPACE = 'cfe7d23c-1bdd-401b-bfb4-f1210694ab83';

const WEB_API_UUID = 'c4218bec-e940-4d68-8807-5c43b2aee27b';
const WEB_API_ONLINE = '562a3aa9-a10e-4347-aa3f-cec9e011a3dc';

export enum InteractionType {
  EMIT,
  COLLECT,
}

export type InteractionReference<
  T extends InteractionType = InteractionType,
  R extends string = string,
> = {
  $: typeof INTERACTION_UUID_NAMESPACE;
  reference: R;
  type: T;
};

// @ts-ignore
export type Match<M, R = TSerialization, D extends number = 50> = Extract<
  Exclude<DeepValuesInclusive<R, D>, InteractionReference>,
  M
>;

export class Api {
  private static _getBroadcastChannel<T>(
    $signal: Signal<T>,
    reference: string,
    abort?: AbortController,
  ) {
    const handleMessage = ({ data }: MessageEvent): void => {
      if (abort?.signal.aborted) return;
      $signal.value = data;
    };

    const channel = new BroadcastChannel(reference);

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

  private static _isInteractionReference(
    input: unknown,
  ): input is InteractionReference {
    if (!isObject(input)) return false;
    if (!('$' in input)) return false;
    if (input.$ !== INTERACTION_UUID_NAMESPACE) return false;

    return true;
  }

  private static _match<M extends object, R extends object>(match: M, root: R) {
    for (const key of objectKeys(match)) {
      const a = root[key as unknown as keyof R] as unknown;
      const b = match[key];

      if (a === b) continue;

      return false;
    }

    return true;
  }

  private readonly _api: Remote<API_WORKER_API>;
  private _hierarchy?: TSerialization;

  readonly isInit: Promise<void>;

  constructor() {
    this._api = wrap(
      new SharedWorker(
        new URL(
          '../workers/api.js',
          import.meta.url,
        ) /* webpackChunkName: 'api' */,
      ).port,
    );

    this.isInit = (async () => {
      await this._api.isInit;
      this._hierarchy = await this._api.hierarchy;

      // eslint-disable-next-line no-console
      console.log(this._hierarchy);
    })();
  }

  get hierarchy(): TSerialization | undefined {
    return this._hierarchy;
  }

  $collector<T>(reference: string): (value: T) => void {
    return (value) => {
      this._api.triggerCollector(reference, value);
    };
  }

  $emitter<T>(
    reference: string,
    abort?: AbortController,
  ): ReadonlySignal<T | undefined> {
    const $signal = signal<T | undefined>(undefined);

    this._api
      .getValue(reference)
      .catch(() => undefined)
      .then((value) => ($signal.value = value as T | undefined));

    Api._getBroadcastChannel($signal, reference, abort);

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

  $streamCount(abort?: AbortController): ReadonlySignal<number | undefined> {
    return this.$emitter(WEB_API_UUID, abort);
  }

  $typedCollector<
    R extends string,
    S extends InteractionReference<InteractionType.COLLECT, R>,
    T extends ValueType,
  >({
    setState,
  }: {
    setState: S;
    valueType: T;
  }): (value: TValueType[T]) => void {
    return this.$collector(setState.reference);
  }

  $typedEmitter<
    R extends string,
    S extends InteractionReference<InteractionType.EMIT, R>,
    T extends ValueType,
  >({
    state,
  }: {
    state: S;
    valueType: T;
  }): ReadonlySignal<TValueType[T] | undefined> {
    return this.$emitter(state.reference);
  }

  match<M extends object, D extends number = 50, R = TSerialization>(
    match: M,
    depth = 50 as D,
    root?: R,
  ): Match<M, R, D>[] {
    if (depth < 0) return [];

    // @ts-ignore
    const root_ = root ?? (this._hierarchy as R);
    if (!root_) return [];
    if (!isObject(root_)) return [];
    if (Api._isInteractionReference(root_)) return [];

    const localMatch = Api._match(match, root_) ? [root] : [];

    const nextDepth = (depth - 1) as Prev[D];
    const childMatch = objectValues(root_).flatMap((child) =>
      this.match(match, nextDepth, child),
    );

    return [localMatch, childMatch].flat(1) as Match<M, R, D>[];
  }
}
