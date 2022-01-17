import { FunctionComponent, createContext } from 'preact';
import { useContext, useLayoutEffect, useState } from 'preact/hooks';
import { useHookDebug } from '../util/hook-debug.js';

const VisibilityContext = createContext(true);

export const VisibilityProvider: FunctionComponent = ({ children }) => {
  useHookDebug('VisibilityProvider');

  const [isVisible, setVisible] = useState(true);

  useLayoutEffect(() => {
    const handleVisibilityChange = () =>
      setVisible(document.visibilityState === 'visible');

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <VisibilityContext.Provider value={isVisible}>
      {children}
    </VisibilityContext.Provider>
  );
};

export const useVisibility = (): boolean => {
  return useContext(VisibilityContext);
};
