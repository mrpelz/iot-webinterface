import { Flags, getFlags, setFlag } from '../util/flags.js';
import { FunctionComponent, createContext } from 'preact';
import {
  StateUpdater,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import { useHookDebug } from '../util/use-hook-debug.js';

type TFlagsContext = readonly [Flags, StateUpdater<Flags>];

const FlagsContext = createContext<TFlagsContext>(
  [] as unknown as TFlagsContext
);

export const FlagProvider: FunctionComponent<{ flags: Flags }> = ({
  children,
  flags: initialFlags,
}) => {
  useHookDebug('useInitFlags');

  const hashChange = useRef(false);
  const [flags, setFlags] = useState(initialFlags);

  useEffect(() => {
    const handleHashChange = () => {
      hashChange.current = true;

      setFlags(getFlags());

      hashChange.current = false;

      if (location.hash.trim().length) return;

      const cleanUrl = new URL(location.href);
      cleanUrl.hash = '';

      history.replaceState(undefined, '', cleanUrl.href);
    };

    addEventListener('hashchange', handleHashChange, { passive: true });
    return () => removeEventListener('hashchange', handleHashChange);
  }, []);

  const value = useMemo(() => [flags, setFlags] as const, [flags]);

  return (
    <FlagsContext.Provider value={value}>{children}</FlagsContext.Provider>
  );
};

export const useFlags = (): Flags => {
  const [flags] = useContext(FlagsContext);

  return useMemo(() => flags, [flags]);
};

export const useFlag = <T extends keyof Flags>(key: T): Flags[T] | null => {
  const [flags] = useContext(FlagsContext);
  const value = flags && key in flags ? flags[key] : null;

  return useMemo(() => value, [value]);
};

export const useSetFlag = <P extends keyof Flags>(
  key: P
): StateUpdater<Flags[P]> => {
  const [flags, setFlags] = useContext(FlagsContext);
  const [value, setValue] = useState(flags[key]);

  useEffect(() => {
    setFlags(setFlag(key, value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value]);

  return setValue;
};
