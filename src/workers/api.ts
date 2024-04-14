import { expose } from 'comlink';

import type { API_WORKER_API, TSerialization } from '../common/types.js';
import { getFlags } from './util.js';

declare const self: SharedWorkerGlobalScope;

const PATH_HIERARCHY = '/api/hierarchy';
const PATH_STREAM = '/api/stream';
const PATH_VALUES = '/api/values';

const WEBSOCKET_PING_INTERVAL = 5000;

const getHierarchy = async () => {
  const { debug, apiBaseUrl } = await getFlags();

  try {
    const hierarchy = await fetch(
      new URL(apiBaseUrl ?? PATH_HIERARCHY, self.location.href).href,
    ).then((response) => response.json() as Promise<TSerialization>);

    // eslint-disable-next-line no-console
    if (debug) console.debug(hierarchy);

    return hierarchy;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(new Error('getHierarchy error', { cause: error }));

    throw error;
  }
};

const api: API_WORKER_API = {
  getHierarchy,
};

self.addEventListener('connect', ({ ports: [port] }) => {
  expose(api, port);
});
