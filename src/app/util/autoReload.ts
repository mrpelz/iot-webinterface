import { AUTO_RELOAD_PATH, getWorker } from './workers.js';
import { shared } from '../index.js';

export const CHECK_INTERVAL = 30000;

export async function autoReload(interval: number): Promise<void> {
  const worker = getWorker(AUTO_RELOAD_PATH, 'autoReload', shared, interval);
  if (!worker) return;

  worker.onmessage = async () => {
    if (!('serviceWorker' in navigator)) {
      location.reload();
    }

    const serviceWorker = await navigator.serviceWorker.ready;
    await serviceWorker.update();

    location.reload();
  };
}
