/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expose } from 'comlink';
import { clear, createStore, set, setMany } from 'idb-keyval';
import rSock, { WebSocketEvent } from 'resilient-websocket';

import type { API_WORKER_API, TSerialization } from '../common/types.js';
import { getFlags } from './util.js';

const ResilientWebSocket = rSock as unknown as typeof rSock.default;

declare const self: SharedWorkerGlobalScope;

// make timers work in 'resilient-websocket' library
Object.defineProperty(globalThis, 'window', { value: self });

const WEB_API_UUID = 'c4218bec-e940-4d68-8807-5c43b2aee27b';
const OBSERVE_NOTIFIER = 'c3a428eb-544e-4d11-927d-4aefcd81210c';

const PATH_HIERARCHY = '/api/hierarchy';
const PATH_STREAM = '/api/stream';
const PATH_VALUES = '/api/values';

const WEBSOCKET_PING_INTERVAL = 1000;

const sleep = () =>
  new Promise((resolve) =>
    setTimeout(() => resolve(undefined), WEBSOCKET_PING_INTERVAL),
  );

class Api implements API_WORKER_API {
  private static async _retry<T>(
    handler: () => Promise<T>,
    tries = 10,
  ): Promise<T> {
    if (tries <= 0) {
      const error = new Error('_retry giving up');
      // eslint-disable-next-line no-console
      console.warn(error);

      throw error;
    }

    try {
      return handler();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(new Error('_retry error', { cause: error }));

      await sleep();
      return Api._retry(handler, tries - 1);
    }
  }

  private readonly _init: Promise<void>;
  private readonly _notifier = new BroadcastChannel(
    `${OBSERVE_NOTIFIER}_${self.name}`,
  );

  private readonly _stateStore = createStore('api_state', 'state');
  private readonly _valuesStore = createStore('api_values', 'values');
  private _webSocket: InstanceType<typeof ResilientWebSocket>;

  constructor() {
    this._init = this._getHierarchy();
    this._initWebSocket();
  }

  // @ts-ignore
  private async _getHierarchy(): Promise<void> {
    const { debug, apiBaseUrl } = await getFlags();

    if (!navigator.onLine) return;

    await set(
      'hierarchy',
      await Api._retry(async () => {
        // @ts-ignore
        const hierarchy = await fetch(
          new URL(PATH_HIERARCHY, apiBaseUrl ?? self.location.href),
        ).then((response) => response.json() as Promise<TSerialization>);

        // eslint-disable-next-line no-console
        if (debug) console.debug(hierarchy);

        return hierarchy;
      }),
      this._stateStore,
    );
  }

  private async _getValues(): Promise<void> {
    const { debug, apiBaseUrl } = await getFlags();

    return Api._retry(async () => {
      const values = await fetch(
        new URL(PATH_VALUES, apiBaseUrl ?? self.location.href),
      ).then((response) => response.json() as Promise<Record<string, unknown>>);

      // eslint-disable-next-line no-console
      if (debug) console.debug(values);

      const entries = Object.entries(values);

      await setMany(entries, this._valuesStore);
      for (const key of Object.keys(values)) {
        this._notifier.postMessage(key);
      }
    }, Number.POSITIVE_INFINITY);
  }

  private async _initWebSocket(): Promise<void> {
    const { apiBaseUrl, debug } = await getFlags();

    const wsUrl = new URL(PATH_STREAM, apiBaseUrl ?? self.location.href);
    wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';

    // eslint-disable-next-line no-console
    if (debug) console.debug('WebSocket URL', wsUrl.href);

    this._webSocket = new ResilientWebSocket(wsUrl.href, {
      pingEnabled: true,
      pingInterval: WEBSOCKET_PING_INTERVAL,
      pingMessage: WEB_API_UUID,
      pongMessage: WEB_API_UUID,
      pongTimeout: WEBSOCKET_PING_INTERVAL,
    });

    this._webSocket.on(WebSocketEvent.CONNECTION, async () => {
      // eslint-disable-next-line no-console
      if (debug) console.debug('WebSocket opened');

      await this._getValues();
      this._notifier.postMessage('online');
    });

    this._webSocket.on(WebSocketEvent.CLOSE, () => {
      // eslint-disable-next-line no-console
      if (debug) console.debug('WebSocket closed');

      this._notifier.postMessage('offline');
    });

    this._webSocket.on(WebSocketEvent.ERROR, () => {
      // eslint-disable-next-line no-console
      if (debug) console.debug('WebSocket error');

      this._notifier.postMessage('offline');
    });

    this._webSocket.on(WebSocketEvent.MESSAGE, async (data) => {
      // eslint-disable-next-line no-console
      if (debug) console.debug('WebSocket message', data);

      try {
        const data_ = JSON.parse(data);
        const [key, value] = Array.isArray(data_) ? data_ : [];

        await set(key, value, this._valuesStore);
        this._notifier.postMessage(key);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('WebSocket incoming message error', error);
      }
    });
  }

  clearStores(): Promise<void> {
    return Promise.all([
      clear(this._stateStore),
      clear(this._valuesStore),
    ]).then(() => {
      // noop
    });
  }

  async init(): Promise<void> {
    await this._init;

    this._notifier.postMessage('hierarchy');
  }

  async triggerCollector<T>(reference: string, value: T) {
    const { debug } = await getFlags();

    // eslint-disable-next-line no-console
    if (debug) console.debug('triggerCollector', { reference, value });

    this._webSocket?.send(JSON.stringify([reference, value] as const));
  }
}

const api: API_WORKER_API = new Api();

self.addEventListener('connect', async ({ ports: [port] }) => {
  const { debug } = await getFlags();

  // eslint-disable-next-line no-console
  if (debug) console.debug('new connection');

  expose(api, port);
});

if (!('SharedWorkerGlobalScope' in self)) expose(api);
