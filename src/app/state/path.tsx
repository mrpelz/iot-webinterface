import { FunctionComponent, createContext } from 'preact';
import {
  StateUpdater,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';
import { amend, getPath, getSegments, goDown, goUp } from '../util/path.js';
import { useHookDebug } from '../util/use-hook-debug.js';

export type TPathContext = {
  isRoot: boolean;
  path: string;
  setPath: StateUpdater<string>;
};

const triggerState = 'C0AAB99B-77E0-45C8-AB13-7EFFA083BC19';
const disableBackcapture =
  'standalone' in navigator && navigator['standalone' as keyof Navigator];

const PathContext = createContext(null as unknown as TPathContext);

export const PathProvider: FunctionComponent<{ rootPathDepth: number }> = ({
  children,
  rootPathDepth,
}) => {
  useHookDebug('PathProvider');

  useEffect(() => {
    if (disableBackcapture) return;

    history.replaceState(triggerState, '');
    history.pushState(undefined, '');
  }, []);

  const [path, setPath] = useState(location.pathname);

  const isRoot = useMemo(
    () => getSegments(path).length <= rootPathDepth,
    [path, rootPathDepth]
  );

  const onPopstate = useCallback(
    ({ state }: PopStateEvent) => {
      if (disableBackcapture) return;
      if (state !== triggerState) return;

      if (isRoot) {
        history.back();

        setTimeout(() => {
          history.pushState(undefined, '', amend(path));
        }, 100);

        return;
      }

      history.pushState(undefined, '');
      setPath(goUp(path));
    },
    [isRoot, path]
  );

  useEffect(() => {
    window.addEventListener('popstate', onPopstate);
    return () => window.removeEventListener('popstate', onPopstate);
  }, [onPopstate]);

  useEffect(() => {
    history.replaceState(undefined, '', amend(path));
  }, [path]);

  const value = useMemo(
    () => ({
      isRoot,
      path,
      setPath,
    }),
    [isRoot, path]
  );

  return <PathContext.Provider value={value}>{children}</PathContext.Provider>;
};

export const useGoUp = (): (() => void) | null => {
  const { isRoot, path, setPath } = useContext(PathContext);

  return useMemo(() => {
    if (isRoot) return null;
    return () => setPath(goUp(path));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRoot, path]);
};

export const useSegment = (
  segmentNumber: number
): [string | null, (value: string | null) => void] => {
  const { path, setPath } = useContext(PathContext);

  const segment = useMemo(
    () => getSegments(path)[segmentNumber] || null,
    [segmentNumber, path]
  );

  const setter = useCallback(
    (value: string | null) => {
      const segments = getSegments(path);
      if (segments.length < segmentNumber) return;
      if (segment === value) return;

      const basePath = getPath(segments.slice(0, segmentNumber));
      setPath(value ? goDown(basePath, value) : basePath);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [path, segment, segmentNumber]
  );

  return useMemo(() => [segment, setter], [segment, setter]);
};
