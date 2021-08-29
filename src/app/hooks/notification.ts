import {
  FallbackNotificationOptions,
  Notifications,
} from '../util/notifications.js';
import { useContext, useState } from 'preact/hooks';
import { createContext } from 'preact';

export const FallbackNotificationContext =
  createContext<FallbackNotificationOptions>(null);

export function useInitFallbackNotification(
  notifications: Notifications
): FallbackNotificationOptions {
  const [fallbackNotification, setFallbackNotification] =
    useState<FallbackNotificationOptions>(null);

  notifications.setFallbackNotificationCallback((options) =>
    setFallbackNotification(options)
  );

  return fallbackNotification;
}

export function useNotification(): FallbackNotificationOptions {
  return useContext(FallbackNotificationContext);
}
