import { Remote, wrap } from 'comlink';

import { API_WORKER_API, TSerialization } from '../common/types.js';
import { DeepRemap, DeepValuesInclusive } from './util/oop.js';

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

type Test = DeepRemap<TSerialization, InteractionReference, MessagePort>;
type TestII = DeepValuesInclusive<Test>;
type TestIII = Extract<TestII, { $: 'offTimer' }>;

// let testIII: TestIII;

// testIII.runoutTime.main.state.addEventListener(
//   'message',
//   () => 'offTimer over!',
// );

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
      // eslint-disable-next-line no-console
      console.log(await this._api.values);
    })();
  }
}
