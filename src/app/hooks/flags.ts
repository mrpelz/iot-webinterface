import { Flags, getFlags } from '../util/flags.js';
import { useContext, useEffect, useState } from 'preact/hooks';
import { createContext } from 'preact';

export const FlagsContext = createContext<Flags>(null as unknown as Flags);

export function useInitFlags(initialFlags: Flags): Flags {
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

  return flags;
}

export function useFlags(): Flags {
  return useContext(FlagsContext);
}
