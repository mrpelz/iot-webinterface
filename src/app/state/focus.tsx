import { FunctionComponent, createContext } from 'preact';
import { useContext, useEffect, useLayoutEffect, useState } from 'preact/hooks';
import { useHookDebug } from '../hooks/use-hook-debug.js';
import { useVisibility } from './visibility.js';

const FocusContext = createContext(true);

export const FocusProvider: FunctionComponent = ({ children }) => {
  useHookDebug('FocusProvider');

  const isVisible = useVisibility();

  const [isFocused, setFocused] = useState(isVisible);

  useLayoutEffect(() => {
    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  useEffect(() => {
    if (isVisible) return;
    setFocused(false);
  }, [isVisible]);

  return (
    <FocusContext.Provider value={isFocused}>{children}</FocusContext.Provider>
  );
};

export const useFocus = (): boolean => {
  return useContext(FocusContext);
};
