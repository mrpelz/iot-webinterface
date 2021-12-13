import { Flags, getFlags } from '../util/flags.js';
import { FunctionComponent, createContext } from 'preact';
import { useContext, useEffect, useMemo, useState } from 'preact/hooks';
import { useHookDebug } from '../util/hook-debug.js';

const FlagsContext = createContext<Flags>(null as unknown as Flags);

export const FlagProvider: FunctionComponent<{ flags: Flags }> = ({
  children,
  flags: initialFlags,
}) => {
  useHookDebug('useInitFlags');

  const [flags, setFlags] = useState(initialFlags);

  useEffect(() => {
    const handleHashChange = () => {
      setFlags(getFlags());

      if (location.hash.trim().length) return;

      const cleanUrl = new URL(location.href);
      cleanUrl.hash = '';

      history.replaceState(undefined, '', cleanUrl.href);
    };

    addEventListener('hashchange', handleHashChange, { passive: true });
    return () => removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <FlagsContext.Provider value={flags}>{children}</FlagsContext.Provider>
  );
};

export const useFlags = (): Flags => {
  return useContext(FlagsContext);
};

export const useFlag = <T extends keyof Flags>(key: T): Flags[T] => {
  const value = useContext(FlagsContext)[key];
  return useMemo(() => value, [value]);
};
