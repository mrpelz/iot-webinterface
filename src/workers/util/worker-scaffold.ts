// eslint-disable-next-line spaced-comment
/// <reference lib="WebWorker" />

const workerDebug = Boolean(
  new URL(self.location.href).searchParams.get('debug')
);

/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const workerConsole = {
  debug: (...args: unknown[]) => {
    if (!workerDebug) return;
    console.debug(`worker "${self.name}":`, ...args);
  },
  error: (...args: unknown[]) => {
    console.error(`worker "${self.name}":`, ...args);
  },
  info: (...args: unknown[]) => {
    if (!workerDebug) return;
    console.info(`worker "${self.name}":`, ...args);
  },
};
/* eslint-enable no-console */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const scaffold = <T>(
  scope: DedicatedWorkerGlobalScope | SharedWorkerGlobalScope,
  handleNewPort?: () => void
) => {
  const voidSetup = Symbol('voidSetup');

  enum WorkerCommands {
    SETUP,
    UNLOAD,
  }

  let setupDone = false;

  return new Promise<[MessagePort, T | null]>((resolve, reject) => {
    if (
      typeof DedicatedWorkerGlobalScope !== 'undefined' &&
      scope instanceof DedicatedWorkerGlobalScope
    ) {
      workerConsole.debug(
        `worker "${scope.location.href}" running as DedicatedWorker`
      );

      let port: MessagePort | undefined;
      let setupMessage: T | typeof voidSetup = voidSetup;

      const launch = () => {
        if (!port || setupMessage === voidSetup) return;

        resolve([port, setupMessage]);
      };

      const handleMessage = ({ data: managementData, ports }: MessageEvent) => {
        if (managementData === WorkerCommands.SETUP) {
          const [communicationPort] = ports;
          if (!communicationPort) return;

          port = communicationPort;
          launch();

          workerConsole.debug('added message port');

          return;
        }

        if (managementData === WorkerCommands.UNLOAD) {
          port?.close();

          return;
        }

        if (setupDone) return;
        setupDone = true;

        setupMessage = managementData;
        launch();

        workerConsole.debug('received setupMessage');
      };

      scope.onmessage = (messageEvent) => handleMessage(messageEvent);

      return;
    }

    if (
      typeof SharedWorkerGlobalScope !== 'undefined' &&
      scope instanceof SharedWorkerGlobalScope
    ) {
      workerConsole.debug(
        `worker "${scope.location.href}" running as SharedWorker`
      );

      const { port1, port2 } = new MessageChannel();

      const messagePorts = new Map<MessagePort, MessagePort>();

      port2.onmessage = ({ data }) => {
        for (const communicationPort of messagePorts.values()) {
          communicationPort.postMessage(data);
        }
      };

      port1.start();
      port2.start();

      const handleMessage = (
        port: MessagePort,
        { data: managementData, ports }: MessageEvent
      ) => {
        if (managementData === WorkerCommands.SETUP) {
          const [communicationPort] = ports;
          if (!communicationPort) return;

          messagePorts.set(port, communicationPort);

          communicationPort.onmessage = ({ data, ports: childPorts }) => {
            if (childPorts.length) {
              port2.postMessage(data, [...childPorts]);

              return;
            }

            port2.postMessage(data);
          };

          communicationPort.start();

          workerConsole.debug(
            `added message port, number of connected ports: ${messagePorts.size}`
          );

          handleNewPort?.();

          return;
        }

        if (managementData === WorkerCommands.UNLOAD) {
          port.close();
          messagePorts.get(port)?.close();

          messagePorts.delete(port);

          workerConsole.debug(
            `removed message port, number of connected ports: ${messagePorts.size}`
          );

          return;
        }

        if (setupDone) return;
        setupDone = true;

        workerConsole.debug('received setupMessage');

        resolve([port1, managementData]);
      };

      scope.onconnect = (connectEvent) => {
        const [port] = connectEvent.ports;

        port.onmessage = (messageEvent) => handleMessage(port, messageEvent);
        port.start();
      };

      return;
    }

    const error = new Error(
      'worker is neither DedicatedWorker nor SharedWorker, aborting'
    );

    // eslint-disable-next-line no-console
    workerConsole.error(error);

    reject(error);
  });
};
