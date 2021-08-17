// eslint-disable-next-line spaced-comment
/// <reference lib="WebWorker" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const scaffold = <T>(
  scope: DedicatedWorkerGlobalScope | SharedWorkerGlobalScope
) => {
  let setupDone = false;

  const SETUP = '16374EFD-22A1-4064-9634-CC213639AD23';
  const UNLOAD = 'BA51CF3C-0145-45A6-B418-41F275DCFA32';

  const { port1, port2 } = new MessageChannel();

  port1.start();
  port2.start();

  return new Promise<[MessagePort, T | null]>((resolve) => {
    if (
      typeof DedicatedWorkerGlobalScope !== 'undefined' &&
      scope instanceof DedicatedWorkerGlobalScope
    ) {
      // eslint-disable-next-line no-console
      console.debug(
        `worker "${scope.name}" (${scope.location.href}) running as DedicatedWorker`
      );

      const handleMessage = ({ data: managementData, ports }: MessageEvent) => {
        if (managementData === SETUP) {
          const communicationPort = ports[0];
          if (!communicationPort) return;

          communicationPort.onmessage = ({ data }) => {
            port2.postMessage(data);
          };

          communicationPort.start();

          port2.onmessage = ({ data }) => {
            communicationPort.postMessage(data);
          };

          // eslint-disable-next-line no-console
          console.debug(`worker "${scope.name}": added message port`);

          return;
        }

        if (managementData === UNLOAD) return;

        if (setupDone) return;
        setupDone = true;

        // eslint-disable-next-line no-console
        console.debug(`worker "${scope.name}": received setupMessage`);

        resolve([port1, managementData]);
      };

      scope.onmessage = (messageEvent) => handleMessage(messageEvent);

      return;
    }

    if (
      typeof SharedWorkerGlobalScope !== 'undefined' &&
      scope instanceof SharedWorkerGlobalScope
    ) {
      // eslint-disable-next-line no-console
      console.debug(
        `worker "${scope.name}" (${scope.location.href}) running as SharedWorker`
      );

      const messagePorts = new Map<MessagePort, MessagePort>();

      port2.onmessage = ({ data }) => {
        for (const communicationPort of messagePorts.values()) {
          communicationPort.postMessage(data);
        }
      };

      const handleMessage = (
        port: MessagePort,
        { data: managementData, ports }: MessageEvent
      ) => {
        if (managementData === SETUP) {
          const communicationPort = ports[0];
          if (!communicationPort) return;

          messagePorts.set(port, communicationPort);

          communicationPort.onmessage = ({ data }) => {
            port2.postMessage(data);
          };

          communicationPort.start();

          // eslint-disable-next-line no-console
          console.debug(
            `worker "${scope.name}": added message port, number of connected ports: ${messagePorts.size}`
          );

          return;
        }

        if (managementData === UNLOAD) {
          port.close();
          messagePorts.get(port)?.close();

          messagePorts.delete(port);

          // eslint-disable-next-line no-console
          console.debug(
            `worker "${scope.name}": removed message port, number of connected ports: ${messagePorts.size}`
          );

          return;
        }

        if (setupDone) return;
        setupDone = true;

        // eslint-disable-next-line no-console
        console.debug(`worker "${scope.name}": received setupMessage`);

        resolve([port1, managementData]);
      };

      scope.onconnect = (connectEvent) => {
        const port = connectEvent.ports[0];

        port.onmessage = (messageEvent) => handleMessage(port, messageEvent);
        port.start();
      };

      return;
    }

    resolve([port1, null]);
  });
};
