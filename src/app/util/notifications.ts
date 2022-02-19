export const requestNotificationPermission = (): void => {
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
};

export const canNotify = (): boolean => {
  return 'Notification' in window && Notification.permission === 'granted';
};

type VoidHandler = () => void;

export type FallbackNotificationOptions = {
  body?: string;
  onClick?: VoidHandler;
  onDismiss?: VoidHandler;
  title: string;
} | null;

export type FallbackNotificationCallback = (
  options: FallbackNotificationOptions
) => void;

export class Notifications {
  private _fallbackNotificationCallback: FallbackNotificationCallback | null;
  private readonly _isCapableOfNativeNotifications: boolean;
  private _nativeNotification: Notification | null;

  constructor(enableNativeNotifications: boolean) {
    this._isCapableOfNativeNotifications = (() => {
      if (!enableNativeNotifications) return false;
      if (!('Notification' in window)) return false;
      if (Notification.permission === 'denied') return false;

      return true;
    })();
  }

  private get _hasNotificationPermission() {
    return (
      this._isCapableOfNativeNotifications &&
      Notification.permission === 'granted'
    );
  }

  clear(): void {
    if (!this._isCapableOfNativeNotifications) {
      this._fallbackNotificationCallback?.(null);

      return;
    }

    if (this._nativeNotification) {
      this._nativeNotification.onclick = null;
      this._nativeNotification.onclose = null;
      this._nativeNotification.close();

      this._nativeNotification = null;
    }
  }

  setFallbackNotificationCallback(
    callback: FallbackNotificationCallback
  ): void {
    this._fallbackNotificationCallback = callback;
  }

  async trigger(
    title: string,
    options?: NotificationOptions,
    onClick?: VoidHandler,
    onDismiss?: VoidHandler
  ): Promise<void> {
    this.clear();

    if (!this._isCapableOfNativeNotifications) {
      this._fallbackNotificationCallback?.({
        body: options?.body,
        onClick,
        onDismiss,
        title,
      });

      return;
    }

    if (!this._hasNotificationPermission) {
      this._fallbackNotificationCallback?.({
        body: options?.body,
        onClick: async () => {
          await Notification.requestPermission();
          onClick?.();
        },
        onDismiss,
        title,
      });
    }

    this._nativeNotification = new Notification(title, options);

    if (onClick) this._nativeNotification.onclick = () => onClick();
    if (onDismiss) this._nativeNotification.onclose = () => onDismiss();
  }
}
