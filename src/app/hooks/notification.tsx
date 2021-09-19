import {
  FallbackNotificationOptions,
  Notifications,
} from '../util/notifications.js';
import { FunctionComponent, createContext } from 'preact';
import { StateUpdater, useContext, useState } from 'preact/hooks';

export type TFallbackNotificationContext = {
  fallbackNotification: FallbackNotificationOptions;
  setFallbackNotification: StateUpdater<FallbackNotificationOptions>;
};

const FallbackNotificationContext = createContext<TFallbackNotificationContext>(
  {
    fallbackNotification: null,
    setFallbackNotification: () => undefined,
  }
);

export function useInitFallbackNotification(
  notifications: Notifications
): FunctionComponent {
  const [fallbackNotification, setFallbackNotification] =
    useState<FallbackNotificationOptions>(null);

  notifications.setFallbackNotificationCallback((options) =>
    setFallbackNotification(options)
  );

  return ({ children }) => (
    <FallbackNotificationContext.Provider
      value={{
        fallbackNotification,
        setFallbackNotification,
      }}
    >
      {children}
    </FallbackNotificationContext.Provider>
  );
}

export function useNotification(): FallbackNotificationOptions {
  return useContext(FallbackNotificationContext).fallbackNotification;
}

export function useSetNotification(): StateUpdater<FallbackNotificationOptions> {
  return useContext(FallbackNotificationContext).setFallbackNotification;
}
