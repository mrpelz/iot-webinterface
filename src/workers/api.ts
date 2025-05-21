/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expose } from 'comlink';

import type { API_WORKER_API, TSerialization } from '../common/types.js';
import { getFlags } from './util.js';

declare const self: SharedWorkerGlobalScope;

type Values = Map<string, { channel: BroadcastChannel; value: unknown }>;

const WEB_API_UUID = 'c4218bec-e940-4d68-8807-5c43b2aee27b';
const WEB_API_ONLINE = '562a3aa9-a10e-4347-aa3f-cec9e011a3dc';

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

  private _values?: Values;
  private _webSocket?: WebSocket;
  private _webSocketOfflineTimeout?: ReturnType<typeof setTimeout>;
  private _webSocketOnline = new BroadcastChannel(WEB_API_ONLINE);
  private _webSocketPingInterval?: ReturnType<typeof setInterval>;
  readonly hierarchy: Promise<TSerialization>;
  readonly isInit: Promise<void>;

  constructor() {
    this._initWebSocket();

    this.hierarchy = this._getHierarchy();

    this.isInit = this.hierarchy.then(() => {
      // noop
    });
  }

  // @ts-ignore
  private async _getHierarchy(): Promise<TSerialization> {
    const { debug, apiBaseUrl } = await getFlags();

    return Api._retry(async () => {
      // @ts-ignore
      const hierarchy = await fetch(
        new URL(PATH_HIERARCHY, apiBaseUrl ?? self.location.href),
      ).then((response) => response.json() as Promise<TSerialization>);

      // eslint-disable-next-line no-console
      if (debug) console.debug(hierarchy);

      return hierarchy;
    });
  }

  private async _getValues(): Promise<void> {
    const { debug, apiBaseUrl } = await getFlags();

    return Api._retry(async () => {
      const values = await fetch(
        new URL(PATH_VALUES, apiBaseUrl ?? self.location.href),
      ).then((response) => response.json() as Promise<Record<string, unknown>>);

      // eslint-disable-next-line no-console
      if (debug) console.debug(values);

      const result: Values = new Map();

      for (const [key, value] of Object.entries(values)) {
        const channel = new BroadcastChannel(key);
        channel.postMessage(value);

        result.set(key, { channel, value });
      }

      this._values = result;
    });
  }

  private async _handleWebSocketOnline(online?: boolean) {
    clearTimeout(this._webSocketOfflineTimeout);

    if (online === false) {
      this._webSocketOnline.postMessage(false);

      this._webSocket?.close();
      this._webSocket = undefined;

      return;
    }

    if (online === true) {
      await this._getValues();
      this._webSocketOnline.postMessage(true);
    }

    clearInterval(this._webSocketPingInterval);
    this._webSocketPingInterval = setInterval(() => {
      this._webSocket?.send(WEB_API_UUID);

      this._webSocketOfflineTimeout = setTimeout(() => {
        this._webSocket?.close();
        this._webSocket = undefined;
      }, WEBSOCKET_PING_INTERVAL);

      if (!this._webSocket) {
        this._initWebSocket();
      }
    }, WEBSOCKET_PING_INTERVAL);
  }

  private async _initWebSocket(): Promise<void> {
    const { apiBaseUrl, debug } = await getFlags();

    const wsUrl = new URL(PATH_STREAM, apiBaseUrl ?? self.location.href);
    wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';

    // eslint-disable-next-line no-console
    if (debug) console.debug('WebSocket URL', wsUrl.href);

    const ws = new WebSocket(wsUrl);
    this._handleWebSocketOnline();

    ws.addEventListener('open', () => {
      // eslint-disable-next-line no-console
      if (debug) console.debug('WebSocket opened');

      this._webSocket = ws;
      this._handleWebSocketOnline(true);
    });

    ws.addEventListener('close', () => {
      // eslint-disable-next-line no-console
      if (debug) console.debug('WebSocket closed');

      this._handleWebSocketOnline(false);
    });

    ws.addEventListener('error', () => {
      // eslint-disable-next-line no-console
      if (debug) console.debug('WebSocket error');

      this._handleWebSocketOnline(false);
    });

    ws.addEventListener('message', async ({ data }) => {
      // eslint-disable-next-line no-console
      if (debug) console.debug('WebSocket message', data);

      if (data === WEB_API_UUID) {
        clearTimeout(this._webSocketOfflineTimeout);

        return;
      }

      try {
        const [key, value] = JSON.parse(data) ?? [];

        const values = await this._values;
        values?.get(key)?.channel.postMessage(value);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('WebSocket incoming message error', error);
      }
    });
  }

  async getValue<T>(reference: string) {
    const { debug } = await getFlags();

    const values = await this._values;
    const result = (values?.get(reference)?.value ?? undefined) as
      | T
      | undefined;

    // eslint-disable-next-line no-console
    if (debug) console.debug('getValue', { reference, result });

    return result;
  }

  isOnline() {
    return Boolean(this._webSocket);
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
