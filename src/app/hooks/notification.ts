import {
  FallbackNotificationOptions,
  Notifications,
} from '../util/notifications.js';
import { StateUpdater, useContext, useState } from 'preact/hooks';
import { createContext } from 'preact';

export type TFallbackNotificationContext = {
  fallbackNotification: FallbackNotificationOptions;
  setFallbackNotification: StateUpdater<FallbackNotificationOptions>;
};

export const FallbackNotificationContext =
  createContext<TFallbackNotificationContext>({
    fallbackNotification: null,
    setFallbackNotification: () => undefined,
  });

export function useInitFallbackNotification(
  notifications: Notifications
): TFallbackNotificationContext {
  const [fallbackNotification, setFallbackNotification] =
    useState<FallbackNotificationOptions>(null);

  notifications.setFallbackNotificationCallback((options) =>
    setFallbackNotification(options)
  );

  return {
    fallbackNotification,
    setFallbackNotification,
  };
}

export function useNotification(): FallbackNotificationOptions {
  return useContext(FallbackNotificationContext).fallbackNotification;
}

export function useSetNotification(): StateUpdater<FallbackNotificationOptions> {
  return useContext(FallbackNotificationContext).setFallbackNotification;
}
