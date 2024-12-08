/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  DEFAULT_MATCH_DEPTH,
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
        { name: 'api' },
      ).port,
    );

    this.isInit = (async () => {
      await this._api.isInit;
      // @ts-ignore
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
    S extends InteractionReference<R, InteractionType.COLLECT>,
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
    S extends InteractionReference<R, InteractionType.EMIT>,
    T extends ValueType,
  >(
    {
      state,
    }: {
      state: S;
      valueType: T;
    },
    abort?: AbortController,
  ): ReadonlySignal<TValueType[T] | undefined> {
    return this.$emitter(state.reference, abort);
  }

  match<
    P extends object,
    D extends number = typeof DEFAULT_MATCH_DEPTH,
    R extends object = TSerialization,
  >(
    pattern: P,
    depth = DEFAULT_MATCH_DEPTH as D,
    root = this.hierarchy as R,
  ): Match<P, R, D>[] {
    return match(pattern, root, depth);
  }
}
