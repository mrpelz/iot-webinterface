/* eslint-disable no-restricted-globals */
// eslint-disable-next-line spaced-comment
/// <reference lib="WebWorker" />

((scope) => {
  const ID_URL = '/id.json';

  const fn = async (port: MessagePort, interval: number) => {
    const getLiveId = () =>
      fetch(ID_URL)
        .then((response) => response.json())
        .then(({ id }) => (id as number).toString())
        .catch(() => null);

    let storedId = await getLiveId();

    setInterval(async () => {
      const liveId = await getLiveId();

      if (storedId === liveId) return;
      if (liveId === null) return;

      storedId = liveId;

      port.postMessage(null);
    }, interval);
  };

  scope.self.onmessage = ({ data, ports }: MessageEvent) => {
    if (!ports) return;

    const port = ports[0];
    if (!port) return;

    fn(port, data);
  };
})(self as unknown as DedicatedWorkerGlobalScope);
