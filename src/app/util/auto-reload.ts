import { autoReloadUrl, connectWorker } from './workers.js';

export const CHECK_INTERVAL = 30000;

export async function autoReload(interval: number): Promise<void> {
  const port = connectWorker(autoReloadUrl, 'auto-reload', interval);
  if (!port) return;

  port.onmessage = async () => {
    if (!('serviceWorker' in navigator)) {
      location.reload();
    }

    const serviceWorker = await navigator.serviceWorker.ready;
    await serviceWorker.update();

    location.reload();
  };
}
