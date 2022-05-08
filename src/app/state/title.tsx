import { FunctionComponent, createContext } from 'preact';
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

export type TTitleContext = {
  setSubtitleOverride: StateUpdater<string | null>;
  setTitleOverride: StateUpdater<string | null>;
  subtitle: string | null;
  title: string | null;
};

const TitleContext = createContext(null as unknown as TTitleContext);

const appName = document.title;

export const TitleProvider: FunctionComponent = ({ children }) => {
  useHookDebug('TitleProvider');

  const [staticPage] = useNavigationStaticPage();
  const staticPageName = useI18nKey(staticPage || undefined);

  const [room] = useNavigationRoom();
  const roomName = useI18nKey(room?.meta.name);
  const roomLabel = useI18nKey('room');

  const [titleOverride, setTitleOverride] = useState<string | null>(null);
  const [subtitleOverride, setSubtitleOverride] = useState<string | null>(null);

  const title = useMemo(
    () => titleOverride || staticPageName || roomName,
    [roomName, staticPageName, titleOverride]
  );

  const subtitle = useMemo(
    () => subtitleOverride || (room ? roomLabel : null),
    [subtitleOverride, room, roomLabel]
  );

  const value = useMemo(
    () =>
      ({
        setSubtitleOverride,
        setTitleOverride,
        subtitle,
        title,
      } as const),
    [subtitle, title]
  );

  useEffect(() => {
    document.title = [title, appName].filter(Boolean).join(' | ');
  }, [title]);

  return (
    <TitleContext.Provider value={value}>{children}</TitleContext.Provider>
  );
};

export const useTitle = (): string | null => {
  const { title } = useContext(TitleContext);

  return useMemo(() => title, [title]);
};

export const useSubtitle = (): string | null => {
  const { subtitle } = useContext(TitleContext);

  return useMemo(() => subtitle, [subtitle]);
};

export const useSetTitleOverride = (): StateUpdater<string | null> => {
  const { setTitleOverride } = useContext(TitleContext);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => setTitleOverride, []);
};

export const useSetSubtitleOverride = (): StateUpdater<string | null> => {
  const { setSubtitleOverride } = useContext(TitleContext);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => setSubtitleOverride, []);
};
