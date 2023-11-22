const workerDebug = Boolean(
  new URL(self.location.href).searchParams.get('debug'),
);

/* eslint-disable no-console */
export const workerConsole = {
  debug: (...args: unknown[]): void => {
    if (!workerDebug) return;
    console.debug(`worker "${self.name}":`, ...args);
  },
  error: (...args: unknown[]): void => {
    console.error(`worker "${self.name}":`, ...args);
  },
  info: (...args: unknown[]): void => {
    if (!workerDebug) return;
    console.info(`worker "${self.name}":`, ...args);
  },
};
/* eslint-enable no-console */

export const scaffold = <T>(
  scope: SharedWorkerGlobalScope,
  handleNewPort?: (port: MessagePort) => void,
): Promise<[MessagePort, T | null]> => {
  enum WorkerCommands {
    SETUP,
    UNLOAD,
    PING,
  }

  let setupDone = false;

  return new Promise<[MessagePort, T | null]>((resolve) => {
    if (typeof SharedWorkerGlobalScope === undefined) return;
    if (!(scope instanceof SharedWorkerGlobalScope)) return;
    workerConsole.debug(
      `worker "${scope.location.href}" running as SharedWorker`,
    );

    const { port1, port2 } = new MessageChannel();

    const messagePorts = new Map<MessagePort, MessagePort>();

    port2.addEventListener('message', ({ data }) => {
      for (const communicationPort of messagePorts.values()) {
        communicationPort.postMessage(data);
      }
    });

    port1.start();
    port2.start();

    const handleMessage = (
      port: MessagePort,
      { data: managementData, ports }: MessageEvent,
    ) => {
      if (managementData === WorkerCommands.SETUP) {
        const [communicationPort] = ports;
        if (!communicationPort) return;

        messagePorts.set(port, communicationPort);

        communicationPort.addEventListener(
          'message',
          ({ data, ports: childPorts }) => {
            if (childPorts.length > 0) {
              port2.postMessage(data, [...childPorts]);

              return;
            }

            port2.postMessage(data);
          },
        );

        communicationPort.start();

        workerConsole.debug(
          `added message port, number of connected ports: ${messagePorts.size}`,
        );

        handleNewPort?.(communicationPort);

        return;
      }

      if (managementData === WorkerCommands.UNLOAD) {
        port.close();
        messagePorts.get(port)?.close();

        messagePorts.delete(port);

        workerConsole.debug(
          `removed message port, number of connected ports: ${messagePorts.size}`,
        );

        return;
      }

      if (managementData === WorkerCommands.PING) {
        port.postMessage(null);
        return;
      }

      if (setupDone) return;
      setupDone = true;

      workerConsole.debug('received setupMessage');

      resolve([port1, managementData]);
    };

    scope.addEventListener('connect', (connectEvent) => {
      const [port] = connectEvent.ports;

      port.addEventListener('message', (messageEvent) =>
        handleMessage(port, messageEvent),
      );
      port.start();
    });
  });
};
