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
import { useNavigationRoom, useNavigationStaticPage } from './navigation.js';
import { getCapitalization, getTranslation } from './translation.js';

export type TTitleContext = {
  capitalizedTitle: string | null;
  setTitleOverride: Dispatch<StateUpdater<string | null>>;
  title: string | null;
};

const TitleContext = createContext(null as unknown as TTitleContext);

const appName = document.title;

export const TitleProvider: FunctionComponent = ({ children }) => {
  useHookDebug('TitleProvider');

  const [staticPage] = useNavigationStaticPage();
  const staticPageName = getSignal(getTranslation(staticPage || undefined));

  const [room] = useNavigationRoom();
  const roomName = getSignal(getTranslation(room?.meta.name));

  const [titleOverride, setTitleOverride] = useState<string | null>(null);

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

export const useTitle = (): string | null => {
  const { title } = useContext(TitleContext);

  return useMemo(() => title, [title]);
};

export const useCapitalizedTitle = (): string | null => {
  const { capitalizedTitle } = useContext(TitleContext);

  return useMemo(() => capitalizedTitle, [capitalizedTitle]);
};

export const useSetTitleOverride = (override: string | null): void => {
  const { setTitleOverride } = useContext(TitleContext);

  useEffect(() => {
    setTitleOverride(override);

    return () => setTitleOverride(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [override]);
};
