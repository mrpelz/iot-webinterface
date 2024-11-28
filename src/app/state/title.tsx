import { createContext, FunctionComponent } from 'preact';
import {
  Dispatch,
  StateUpdater,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';

import { useHookDebug } from '../hooks/use-hook-debug.js';
import { getSignal } from '../util/signal.js';
import { getCapitalization, getTranslation } from './translation.js';

export type TTitleContext = {
  capitalizedTitle: string | undefined;
  setTitleOverride: Dispatch<StateUpdater<string | undefined>>;
  title: string | undefined;
};

const TitleContext = createContext(null as unknown as TTitleContext);

const appName = document.title;

export const TitleProvider: FunctionComponent = ({ children }) => {
  useHookDebug('TitleProvider');

  const staticPageName = getSignal(getTranslation(''));

  const roomName = getSignal(getTranslation(''));

  const [titleOverride, setTitleOverride] = useState<string | undefined>(
    undefined,
  );

  const title = useMemo(
    () => titleOverride || staticPageName || roomName,
    [roomName, staticPageName, titleOverride],
  );

  const capitalizedTitle = getSignal(getCapitalization(title));

  const value = useMemo(
    () => ({ capitalizedTitle, setTitleOverride, title }) as const,
    [capitalizedTitle, title],
  );

  useEffect(() => {
    document.title = [capitalizedTitle, appName].filter(Boolean).join(' | ');
  }, [capitalizedTitle]);

  return (
    <TitleContext.Provider value={value}>{children}</TitleContext.Provider>
  );
};

export const useTitle = (): string | undefined => {
  const { title } = useContext(TitleContext);

  return useMemo(() => title, [title]);
};

export const useCapitalizedTitle = (): string | undefined => {
  const { capitalizedTitle } = useContext(TitleContext);

  return useMemo(() => capitalizedTitle, [capitalizedTitle]);
};

export const useSetTitleOverride = (override: string | undefined): void => {
  const { setTitleOverride } = useContext(TitleContext);

  useEffect(() => {
    setTitleOverride(override);

    return () => setTitleOverride(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [override]);
};
