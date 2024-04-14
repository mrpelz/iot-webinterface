import { Remote, wrap } from 'comlink';

import { API_WORKER_API, TSerialization } from '../common/types.js';

const INTERACTION_UUID_NAMESPACE = 'cfe7d23c-1bdd-401b-bfb4-f1210694ab83';

export enum InteractionType {
  EMIT,
  COLLECT,
}

export type InteractionReference<
  R extends string = string,
  T extends InteractionType = InteractionType,
> = {
  $: typeof INTERACTION_UUID_NAMESPACE;
  reference: R;
  type: T;
};

export type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[],
];

export type DeepRemap<T extends object, S, R, D extends number = 20> = [
  D,
] extends [never]
  ? never
  : {
      [K in keyof T]: T[K] extends S
        ? R
        : T[K] extends object
          ? DeepRemap<T[K], S, R, Prev[D]>
          : T[K];
    };

export type DeepValuesInclusive<T, D extends number = 20> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: T[K] | DeepValuesInclusive<T[K], Prev[D]>;
      }[keyof T]
    : T;

type Test = DeepRemap<TSerialization, InteractionReference, MessagePort>;
type TestII = DeepValuesInclusive<Test>;
type TestIII = Extract<TestII, { $: 'ev1527Device' }>;

export class Api {
  private readonly _api: Remote<API_WORKER_API>;

  private readonly _worker = new SharedWorker(
    new URL(/* webpackChunkName: "api" */ '../workers/api.js', import.meta.url),
  );

  constructor() {
    this._api = wrap(this._worker.port);

    (async () => {
      await this._api.init();

      // eslint-disable-next-line no-console
      console.log(await this._api.hierarchy);
    })();
  }
}
