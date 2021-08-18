export function requestNotificationPermission(): void {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') return;
  if (Notification.permission === 'denied') return;

  addEventListener(
    'click',
    () => {
      if (Notification.permission !== 'default') return;

      setTimeout(() => Notification.requestPermission(), 1000);
    },
    { once: true, passive: true }
  );
}

export function canNotify(): boolean {
  return 'Notification' in window && Notification.permission === 'granted';
}
