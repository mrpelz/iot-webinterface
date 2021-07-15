/* eslint-disable no-restricted-globals */
// eslint-disable-next-line spaced-comment
/// <reference lib="WebWorker" />

((scope) => {
  const UNLOAD = 'BA51CF3C-0145-45A6-B418-41F275DCFA32';

  const messagePorts = new Set<MessagePort>();

  const handleMessage = (
    messagePort: MessagePort,
    messageEvent: MessageEvent
  ) => {
    if (messageEvent.data === UNLOAD) {
      messagePorts.delete(messagePort);

      // eslint-disable-next-line no-console
      console.debug('removed message port', messagePorts.size);

      return;
    }

    // eslint-disable-next-line no-console
    console.debug('shared worker', messageEvent.data);
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
