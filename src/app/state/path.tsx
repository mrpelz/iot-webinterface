import { FunctionComponent, createContext } from 'preact';
import {
  amend,
  getPath,
  getSegments,
  goDown,
  goUp as goUpUtil,
} from '../util/path.js';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';
import { useHookDebug } from '../util/use-hook-debug.js';
import { usePrevious } from '../util/use-previous.js';

export type TPathContext = {
  getSegment: (segmentNumber: number) => string | null;
  goPrevious: (() => void) | null;
  goUp: (() => void) | null;
  setSegment: (
    segmentNumber: number
  ) => ((value: string | null) => void) | null;
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

  const [previousPath] = usePrevious(path);

  const isRoot = useMemo(
    () => getSegments(path).length <= rootPathDepth,
    [path, rootPathDepth]
  );

  const getSegment = useCallback(
    (segmentNumber: number) => getSegments(path)[segmentNumber] || null,
    [path]
  );

  const goPrevious = useMemo(() => {
    if (!previousPath || getSegments(previousPath).length < rootPathDepth) {
      return null;
    }

    return () => setPath(previousPath);
  }, [previousPath, rootPathDepth]);

  const goUp = useMemo(() => {
    if (isRoot) return null;
    return () => setPath(goUpUtil(path));
  }, [isRoot, path]);

  const setSegment = useMemo(
    () => (segmentNumber: number) => {
      const segments = getSegments(path);
      if (segments.length < segmentNumber) return null;

      return (value: string | null) => {
        const segment = segments[segmentNumber];
        if (segment === value) return;

        const basePath = getPath(segments.slice(0, segmentNumber));
        setPath(value ? goDown(basePath, value) : basePath);
      };
    },
    [path]
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
      setPath(goUpUtil(path));
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
      getSegment,
      goPrevious,
      goUp,
      setSegment,
    }),
    [getSegment, goPrevious, goUp, setSegment]
  );

  return <PathContext.Provider value={value}>{children}</PathContext.Provider>;
};

export const useGoUp = (): TPathContext['goUp'] => {
  const { goUp } = useContext(PathContext);
  return useMemo(() => goUp, [goUp]);
};

export const useGoPrevious = (): TPathContext['goPrevious'] => {
  const { goPrevious } = useContext(PathContext);
  return useMemo(() => goPrevious, [goPrevious]);
};

export const useGoPreviousSegment = (
  segmentNumber: number
): TPathContext['goPrevious'] => {
  const { getSegment, setSegment } = useContext(PathContext);

  const segment = getSegment(segmentNumber);
  const setter = setSegment(segmentNumber);

  const [previousSegment] = usePrevious(segment);

  return useMemo(() => {
    if (!previousSegment || !setter) return null;

    return () => setter(previousSegment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previousSegment]);
};

export const useSegment = (
  segmentNumber: number
): [
  ReturnType<TPathContext['getSegment']>,
  ReturnType<TPathContext['setSegment']>
] => {
  const { getSegment, setSegment } = useContext(PathContext);

  const segment = getSegment(segmentNumber);
  const setter = setSegment(segmentNumber);

  return useMemo(() => [segment, setter], [segment, setter]);
};