import { ComponentChild, FunctionComponent, createContext } from 'preact';
import {
  StateUpdater,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';
import { useNavigationRoom, useNavigationStaticPage } from './navigation.js';
import { useHookDebug } from '../util/use-hook-debug.js';
import { useI18nKey } from './i18n.js';

export type TTitleContext = readonly [
  ComponentChild,
  StateUpdater<ComponentChild>
];

const TitleContext = createContext(null as unknown as TTitleContext);

const appName = document.title;

export const TitleProvider: FunctionComponent = ({ children }) => {
  useHookDebug('TitleProvider');

  const [staticPage] = useNavigationStaticPage();
  const staticPageName = useI18nKey(staticPage || undefined);

  const [room] = useNavigationRoom();
  const roomName = useI18nKey(room?.meta.name);

  const [titleOverride, setTitleOverride] = useState<ComponentChild>(null);

  const title = useMemo(
    () => titleOverride || staticPageName || roomName,
    [roomName, staticPageName, titleOverride]
  );

  const value = useMemo(() => [title, setTitleOverride] as const, [title]);

  useEffect(() => {
    document.title = [title, appName].filter(Boolean).join(' | ');
  }, [title]);

  return (
    <TitleContext.Provider value={value}>{children}</TitleContext.Provider>
  );
};

export const useTitle = (): ComponentChild => {
  const [title] = useContext(TitleContext);

  return useMemo(() => title, [title]);
};

export const useSetTitleOverride = (): StateUpdater<ComponentChild> => {
  const [, setTitleOverride] = useContext(TitleContext);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => setTitleOverride, []);
};
