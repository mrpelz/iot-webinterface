/* eslint-disable no-restricted-globals */
// eslint-disable-next-line spaced-comment
/// <reference lib="WebWorker" />

((scope) => {
  const PROXY_SETUP = '16374EFD-22A1-4064-9634-CC213639AD23' as const;
  const UNLOAD = 'BA51CF3C-0145-45A6-B418-41F275DCFA32' as const;

  type WorkerMessage =
    | {
        command: typeof PROXY_SETUP;
        initValue?: unknown;
        name: string;
        url: string;
      }
    | {
        command: typeof UNLOAD;
      };

  const messagePorts = new Set<MessagePort>();
  const workerPorts = new Map<string, MessagePort>();

  const portPlumbing = (a: MessagePort, b: MessagePort) => {
    a.onmessage = (messageEvent) => {
      const { data } = messageEvent;

      b.postMessage(data);
    };

    a.start();

    b.addEventListener('message', (messageEvent) => {
      const { data } = messageEvent;

      a.postMessage(data);
    });

    b.start();
  };

  const workerProxySetup = (
    url: string,
    name: string,
    port: MessagePort,
    initValue?: unknown
  ) => {
    const existingPort = workerPorts.get(url);

    if (existingPort) {
      portPlumbing(port, existingPort);

      return;
    }

    const { port1, port2 } = new MessageChannel();

    const worker = (() => {
      try {
        return new Worker(url, {
          name,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`error getting Worker "${name}" (${url}): ${error}`);

        return null;
      }
    })();

    if (worker) {
      worker.postMessage(initValue, [port2]);
      workerPorts.set(url, port1);

      portPlumbing(port, port1);
    }
  };

  const handleMessage = (
    messagePort: MessagePort,
    messageEvent: MessageEvent
  ) => {
    if (!messageEvent.data) return;
    const message: WorkerMessage = messageEvent.data;

    if (message.command === UNLOAD) {
      messagePorts.delete(messagePort);

      // eslint-disable-next-line no-console
      console.debug('removed message port', messagePorts.size);

      return;
    }

    if (message.command === PROXY_SETUP) {
      const { initValue, name, url } = message;
      if (!url) return;

      const port = messageEvent.ports[0];

      workerProxySetup(url, name, port, initValue);

      return;
    }

    // eslint-disable-next-line no-console
    console.debug(message);
  };

  scope.onconnect = (connectEvent) => {
    const messagePort = connectEvent.ports[0];

    messagePort.onmessage = (messageEvent) =>
      handleMessage(messagePort, messageEvent);
    messagePort.start();

    messagePorts.add(messagePort);

    // eslint-disable-next-line no-console
    console.debug('added message port', messagePorts.size);
  };
})(self as unknown as SharedWorkerGlobalScope);
