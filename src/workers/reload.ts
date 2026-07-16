import rSock, { WebSocketEvent } from 'resilient-websocket';

import { getFlags } from './util.js';

if (module.hot) module.hot.accept();

const ResilientWebSocket = rSock as unknown as typeof rSock.default;

declare const self: SharedWorkerGlobalScope;

// make timers work in 'resilient-websocket' library
Object.defineProperty(globalThis, 'window', { value: self });

const PATH_WS = '/ws';

const RECONNECT_NOTIFIER = '3ee56e5f-2ddb-4c5e-81a1-8318e05cff72';
const notifier = new BroadcastChannel(`${RECONNECT_NOTIFIER}_${self.name}`);

(async () => {
  const { debug, apiBaseUrl } = await getFlags();

  const wsUrl = new URL(PATH_WS, apiBaseUrl ?? self.location.href);
  wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';

  // eslint-disable-next-line no-console
  if (debug) console.debug('WebSocket URL', wsUrl.href);

  const ws = new ResilientWebSocket(wsUrl.href, {});

  ws.on(WebSocketEvent.MESSAGE, (data) => {
    // eslint-disable-next-line no-console
    if (debug) console.debug('webpack-dev-server message', JSON.parse(data));
    notifier.postMessage(data);
  });
})();
