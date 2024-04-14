import { Remote, wrap } from 'comlink';

import { API_WORKER_API } from '../common/types.js';

export class Api {
  private readonly _api: Remote<API_WORKER_API>;

  private readonly _worker = new SharedWorker(
    new URL(/* webpackChunkName: "api" */ '../workers/api.js', import.meta.url),
  );

  constructor() {
    this._api = wrap(this._worker.port);

    this._api.getHierarchy();
  }
}
