enum WorkerCommands {
  SETUP,
  UNLOAD,
  PING,
}

export const connectWorker = <T>(
  url_: string,
  name: string,
  setupMessage: T | null = null,
  debug: boolean,
): MessagePort | undefined => {
  const { port1, port2 } = new MessageChannel();

  const url = (() => {
    const result = new URL(url_);
    if (debug) result.searchParams.append('debug', '1');

    return result.href;
  })();

  if (!('SharedWorker' in window)) return undefined;

  try {
    const worker = new SharedWorker(url, {
      name,
      type: 'module',
    });

    const { port: managementPort } = worker;
    managementPort.start();

    addEventListener(
      'unload',
      () => managementPort.postMessage(WorkerCommands.UNLOAD),
      {
        once: true,
        passive: true,
      },
    );

    managementPort.postMessage(WorkerCommands.SETUP, [port2]);
    managementPort.postMessage(setupMessage);

    port1.start();

    return port1;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`error creating SharedWorker "${name}" (${url}): ${error}`);

    return undefined;
  }
};
