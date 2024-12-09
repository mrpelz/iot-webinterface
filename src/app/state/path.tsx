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
  getSegment: (segmentNumber: number) => string | undefined;
  goPrevious: (() => void) | undefined;
  goRoot: (() => void) | undefined;
  goUp: (() => void) | undefined;
  isRoot: boolean;
  leaveCallbackRef: MutableRef<(() => void) | undefined>;
  path: string;
  previousPath?: string;
  setSegment: (
    segmentNumber: number,
  ) => ((value: string | undefined) => void) | undefined;
};

const triggerState = 'C0AAB99B-77E0-45C8-AB13-7EFFA083BC19';
const disableBackcapture =
  'standalone' in navigator && navigator['standalone' as keyof Navigator];

const PathContext = createContext(undefined as unknown as TPathContext);

export const PathProvider: FunctionComponent<{ rootPathDepth: number }> = ({
  children,
  rootPathDepth,
}) => {
  useHookDebug('PathProvider');

  const leaveCallbackRef = useRef<(() => void) | undefined>(undefined);

  const isVisible = useVisibility();

  const pathFlag = $flags.path.value ?? null;
  const pathFlagSetter = (path: string | undefined) =>
    ($flags.path.value = path ?? null);

  const [path, setPath] = useState(() => {
    const result = pathFlag || location.pathname;
    pathFlagSetter(undefined);

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
    (segmentNumber: number) => getSegments(path)[segmentNumber] || undefined,
    [path],
  );

  const goPrevious = useMemo(() => {
    if (!previousPath || getSegments(previousPath).length < rootPathDepth) {
      return undefined;
    }

    return () => setPath(previousPath);
  }, [previousPath, rootPathDepth]);

  const goUp = useMemo(() => {
    if (isRoot) return undefined;
    return () => setPath(goUpUtil(path));
  }, [isRoot, path]);

  const setSegment = useCallback(
    (segmentNumber: number) => {
      const segments = getSegments(path);
      if (segments.length < segmentNumber) return undefined;

      return (value: string | undefined) => {
        const segment = segments[segmentNumber];
        if (segment === value) return;

        const basePath = getPath(segments.slice(0, segmentNumber));
        setPath(value ? goDown(basePath, value) : basePath);
      };
    },
    [path],
  );

  const goRoot = useMemo(() => {
    if (isRoot) return undefined;

    const setter = setSegment(rootPathDepth);
    if (!setter) return undefined;

    return () => setter(undefined);
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
    if (!previousSegment || !setter) return undefined;

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
