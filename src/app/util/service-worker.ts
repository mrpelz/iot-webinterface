import type { Workbox } from 'workbox-window';

export let workbox: Workbox | undefined;

export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    const { Workbox } = await import(
      /* webpackChunkName: "workbox-window" */ 'workbox-window'
    );

    workbox = new Workbox('/sw.js');
    workbox.register();
  }
};
