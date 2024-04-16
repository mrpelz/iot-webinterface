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
  private _isInit = false;
  private _offlineTimeout?: ReturnType<typeof setTimeout>;
  private _values = new Map<
    string,
    { channel: BroadcastChannel; value: unknown }
  >();

  private _webSocket?: WebSocket;

  get hierarchy() {
    return this._hierarchy;
  }

  get values() {
    return Object.fromEntries(
      Array.from(this._values.entries()).map(
        ([key, { value }]) => [key, value] as const,
      ),
    );
  }

  private async _getHierarchy(): Promise<void> {
    const { debug, apiBaseUrl } = await getFlags();

    try {
      const hierarchy = await fetch(
        new URL(PATH_HIERARCHY, apiBaseUrl ?? self.location.href),
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

  private async _getValues(): Promise<void> {
    const { debug, apiBaseUrl } = await getFlags();

    try {
      const values = await fetch(
        new URL(PATH_VALUES, apiBaseUrl ?? self.location.href),
      ).then((response) => response.json() as Promise<Record<string, unknown>>);

      // eslint-disable-next-line no-console
      if (debug) console.debug(values);

      for (const [key, value] of Object.entries(values)) {
        const channel = new BroadcastChannel(key);
        channel.postMessage(value);

        this._values.set(key, { channel, value });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(new Error('getValues error', { cause: error }));

      throw error;
    }
  }

  private async _initWebSocket(): Promise<void> {
    const { apiBaseUrl } = await getFlags();

    const wsUrl = new URL(PATH_STREAM, apiBaseUrl ?? self.location.href);
    wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';

    const ws = new WebSocket(wsUrl);

    ws.addEventListener('open', () => {
      this._webSocket = ws;
    });

    ws.addEventListener('close', () => {
      this._webSocket = undefined;
    });

    ws.addEventListener('error', () => {
      this._webSocket = undefined;
      ws.close();
    });

    ws.addEventListener('message', ({ data }) => {
      if (data === WEB_API_UUID) {
        clearTimeout(this._offlineTimeout);

        return;
      }

      try {
        const [key, value] = JSON.parse(data) ?? [];

        this._values.get(key)?.channel.postMessage(value);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('WebSocket incoming message error', error);
      }
    });
  }

  async init(): Promise<void> {
    if (this._isInit) return;
    this._isInit = true;

    await Promise.all([this._getHierarchy(), this._getValues()]);

    setInterval(() => {
      if (this._webSocket) {
        this._webSocket.send(WEB_API_UUID);

        clearTimeout(this._offlineTimeout);
        this._offlineTimeout = setTimeout(() => {
          this._webSocket?.close();
          this._webSocket = undefined;
        }, WEBSOCKET_PING_INTERVAL);

        return;
      }

      this._initWebSocket();
    }, WEBSOCKET_PING_INTERVAL);

    await this._initWebSocket();
  }
}

const api: API_WORKER_API = new Api();

self.addEventListener('connect', async ({ ports: [port] }) => {
  const { debug } = await getFlags();

  // eslint-disable-next-line no-console
  if (debug) console.debug('new connection');

  expose(api, port);
});
