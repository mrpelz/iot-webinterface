import { expose } from 'comlink';

import type { API_WORKER_API, TSerialization } from '../common/types.js';
import { getFlags } from './util.js';

declare const self: SharedWorkerGlobalScope;

const WEB_API_UUID = 'c4218bec-e940-4d68-8807-5c43b2aee27b';

const PATH_HIERARCHY = '/api/hierarchy';
const PATH_STREAM = '/api/stream';
const PATH_VALUES = '/api/values';

const WEBSOCKET_PING_INTERVAL = 5000;

class Api {
  private _hierarchy?: TSerialization;
  private _isStreamConnected = false;

  get hierarchy() {
    return this._hierarchy;
  }

  private async _getHierarchy(): Promise<void> {
    if (this._hierarchy) return;

    const { debug, apiBaseUrl } = await getFlags();

    try {
      const hierarchy = await fetch(
        new URL(apiBaseUrl ?? PATH_HIERARCHY, self.location.href).href,
      ).then((response) => response.json() as Promise<TSerialization>);

      // eslint-disable-next-line no-console
      if (debug) console.debug(hierarchy);

      this._hierarchy = hierarchy;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(new Error('getHierarchy error', { cause: error }));

      throw error;
    }
  }

  async init(): Promise<void> {
    await this._getHierarchy();
  }
}

const api: API_WORKER_API = new Api();

self.addEventListener('connect', async ({ ports: [port] }) => {
  const { debug } = await getFlags();

  // eslint-disable-next-line no-console
  if (debug) console.debug('new connection');

  expose(api, port);
});
