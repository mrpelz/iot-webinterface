import { sleep } from '@mrpelz/misc-utils/sleep';
import { epochs } from '@mrpelz/modifiable-date';

const { promise, resolve } = Promise.withResolvers<NotificationPermission>();
export const notificationPermission = promise;

export const requestNotificationPermission = (): void => {
  if (!('Notification' in globalThis)) {
    resolve('denied');
    return;
  }

  if (Notification.permission !== 'default') {
    resolve(Notification.permission);
    return;
  }

  addEventListener(
    'click',
    async () => {
      await sleep(epochs.second);
      resolve(await Notification.requestPermission());
    },
    { once: true, passive: true },
  );
};

export const canNotify = (): boolean =>
  'Notification' in globalThis && Notification.permission === 'granted';
