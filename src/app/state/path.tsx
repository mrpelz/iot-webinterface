import { createContext, FunctionComponent } from 'preact';
import {
  MutableRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';

import { useHookDebug } from '../hooks/use-hook-debug.js';
import { usePrevious } from '../hooks/use-previous.js';
import { $flags } from '../util/flags.js';
import {
  amend,
  getPath,
  getSegments,
  goDown,
  goUp as goUpUtil,
} from '../util/path.js';
import { useVisibility } from './visibility.js';

export type TPathContext = {
  getSegment: (segmentNumber: number) => string | null;
  goPrevious: (() => void) | null;
  goRoot: (() => void) | null;
  goUp: (() => void) | null;
  isRoot: boolean;
  leaveCallbackRef: MutableRef<(() => void) | null>;
  path: string;
  previousPath: string | null;
  setSegment: (
    segmentNumber: number,
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

  const leaveCallbackRef = useRef<(() => void) | null>(null);

  const isVisible = useVisibility();

  const pathFlag = $flags.path.value;
  const pathFlagSetter = (path: string | null) => ($flags.path.value = path);

  const [path, setPath] = useState(() => {
    const result = pathFlag || location.pathname;
    pathFlagSetter(null);

    return result;
  });
  const [previousPath] = usePrevious(path);

  useEffect(() => {
    if (disableBackcapture) return;

    history.scrollRestoration = 'manual';

    history.replaceState(triggerState, '');
    history.pushState(undefined, '');
  }, []);

  const isRoot = useMemo(
    () => getSegments(path).length <= rootPathDepth,
    [path, rootPathDepth],
  );

  const getSegment = useCallback(
    (segmentNumber: number) => getSegments(path)[segmentNumber] || null,
    [path],
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

  const setSegment = useCallback(
    (segmentNumber: number) => {
      const segments = getSegments(path);
      if (segments.length < segmentNumber) return null;

      return (value: string | null) => {
        const segment = segments[segmentNumber];
        if (segment === value) return;

        const basePath = getPath(segments.slice(0, segmentNumber));
        setPath(value ? goDown(basePath, value) : basePath);
      };
    },
    [path],
  );

  const goRoot = useMemo(() => {
    if (isRoot) return null;

    const setter = setSegment(rootPathDepth);
    if (!setter) return null;

    return () => setter(null);
  }, [isRoot, rootPathDepth, setSegment]);

  const onPopstate = useCallback(
    ({ state }: PopStateEvent) => {
      if (disableBackcapture) return;
      if (state !== triggerState) return;

      const { current: leaveCallback } = leaveCallbackRef;

      if (isRoot) {
        if (leaveCallback) {
          leaveCallback();
        } else if (document.referrer.length > 0) {
          history.back();
        }

        setTimeout(() => {
          history.pushState(undefined, '', amend(path));
        }, 100);

        return;
      }

      history.pushState(undefined, '');
      setPath(goUpUtil(path));
    },
    [isRoot, path],
  );

  useEffect(() => {
    globalThis.addEventListener('popstate', onPopstate);
    return () => globalThis.removeEventListener('popstate', onPopstate);
  }, [onPopstate]);

  useEffect(() => {
    history.replaceState(undefined, '', amend(path));
  }, [path]);

  const value = useMemo(
    () => ({
      getSegment,
      goPrevious,
      goRoot,
      goUp,
      isRoot,
      leaveCallbackRef,
      path,
      previousPath,
      setSegment,
    }),
    [
      getSegment,
      goPrevious,
      goRoot,
      goUp,
      isRoot,
      path,
      previousPath,
      setSegment,
    ],
  );

  useEffect(() => {
    if (!goRoot || isVisible) return;
    goRoot();
  }, [goRoot, isVisible]);

  return <PathContext.Provider value={value}>{children}</PathContext.Provider>;
};

export const usePathContext = (): TPathContext => useContext(PathContext);

export const useGoPrevious = (): TPathContext['goPrevious'] => {
  const { goPrevious } = useContext(PathContext);
  return useMemo(() => goPrevious, [goPrevious]);
};

export const useSegment = (
  segmentNumber: number,
): [
  ReturnType<TPathContext['getSegment']>,
  ReturnType<TPathContext['setSegment']>,
] => {
  const { getSegment, setSegment } = useContext(PathContext);

  const segment = getSegment(segmentNumber);
  const setter = setSegment(segmentNumber);

  return useMemo(() => [segment, setter], [segment, setter]);
};

export const useGoPreviousSegment = (
  segmentNumber: number,
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

export const useGoRoot = (): TPathContext['goRoot'] => {
  const { goRoot } = useContext(PathContext);
  return useMemo(() => goRoot, [goRoot]);
};

export const useGoUp = (): TPathContext['goUp'] => {
  const { goUp } = useContext(PathContext);
  return useMemo(() => goUp, [goUp]);
};

export const useIsRoot = (): TPathContext['isRoot'] => {
  const { isRoot } = useContext(PathContext);
  return useMemo(() => isRoot, [isRoot]);
};

export const useLeaveCallbackRef = (): TPathContext['leaveCallbackRef'] => {
  const { leaveCallbackRef } = useContext(PathContext);
  return useMemo(() => leaveCallbackRef, [leaveCallbackRef]);
};

export const usePath = (): TPathContext['path'] => {
  const { path } = useContext(PathContext);
  return useMemo(() => path, [path]);
};

export const usePreviousPath = (): TPathContext['previousPath'] => {
  const { previousPath } = useContext(PathContext);
  return useMemo(() => previousPath, [previousPath]);
};
