import {
  FallbackNotificationOptions,
  Notifications,
} from '../util/notifications.js';
import { FunctionComponent, createContext } from 'preact';
import {
  StateUpdater,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';
import { useHookDebug } from '../util/hook-debug.js';

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

export const FallbackNotificationProvider: FunctionComponent<{
  notifications: Notifications;
}> = ({ children, notifications }) => {
  useHookDebug('useInitFallbackNotification');

  const [fallbackNotification, setFallbackNotification] =
    useState<FallbackNotificationOptions>(null);

  useEffect(() => {
    notifications.setFallbackNotificationCallback((options) =>
      setFallbackNotification(options)
    );
  }, [notifications]);

  const value = useMemo(
    () => ({
      fallbackNotification,
      setFallbackNotification,
    }),
    [fallbackNotification]
  );

  return (
    <FallbackNotificationContext.Provider value={value}>
      {children}
    </FallbackNotificationContext.Provider>
  );
};

export const useNotification = (): FallbackNotificationOptions => {
  const { fallbackNotification } = useContext(FallbackNotificationContext);
  return useMemo(() => fallbackNotification, [fallbackNotification]);
};

export const useSetNotification =
  (): StateUpdater<FallbackNotificationOptions> => {
    const { setFallbackNotification } = useContext(FallbackNotificationContext);
    return useMemo(() => setFallbackNotification, [setFallbackNotification]);
  };