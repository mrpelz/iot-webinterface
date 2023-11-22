import { createContext, FunctionComponent } from 'preact';
import { useContext, useEffect, useLayoutEffect, useState } from 'preact/hooks';

import { useHookDebug } from '../hooks/use-hook-debug.js';
import { useFlag } from './flags.js';

const VisibilityContext = createContext(true);

export const VisibilityProvider: FunctionComponent = ({ children }) => {
  useHookDebug('VisibilityProvider');

  const inactivityTimeout = useFlag('inactivityTimeout');

  const [isVisible, setVisible] = useState(true);

  useLayoutEffect(() => {
    const handleVisibilityChange = () =>
      setVisible(document.visibilityState === 'visible');

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const listenerAbort = new AbortController();

    let timeout: ReturnType<typeof setTimeout> | null = null;
    const abortTimeout = () => {
      if (timeout) clearTimeout(timeout);
      timeout = null;
    };

    if (inactivityTimeout) {
      const onInactivityTimeout = (event?: Event) => {
        abortTimeout();
        setVisible(true);

        if (event?.type === 'pointerdown') return;

        timeout = setTimeout(() => setVisible(false), inactivityTimeout);
      };

      const listenerOptions = {
        capture: true,
        passive: true,
        signal: listenerAbort.signal,
      };

      addEventListener('pointerdown', onInactivityTimeout, listenerOptions);
      addEventListener('pointerup', onInactivityTimeout, listenerOptions);
      addEventListener('pointermove', onInactivityTimeout, listenerOptions);
      addEventListener('pointercancel', onInactivityTimeout, listenerOptions);
      addEventListener('scroll', onInactivityTimeout, listenerOptions);

      onInactivityTimeout();
    }

    return () => {
      listenerAbort.abort();
      abortTimeout();

      setVisible(true);
    };
  }, [inactivityTimeout]);

  return (
    <VisibilityContext.Provider value={isVisible}>
      {children}
    </VisibilityContext.Provider>
  );
};

export const useVisibility = (): boolean => useContext(VisibilityContext);
