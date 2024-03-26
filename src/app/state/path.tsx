import { computed, effect, signal } from '@preact/signals';
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
import { previous } from '../signals/previous.js';
import { flags } from '../util/flags.js';
import {
  amend,
  getPath,
  getSegments,
  goDown,
  goUp as goUpUtil,
} from '../util/path.js';
import { callbackSignal, callbackUnwrapped, readOnly } from '../util/signal.js';
import { $isVisible } from './visibility.js';

const TRIGGER_STATE = 'C0AAB99B-77E0-45C8-AB13-7EFFA083BC19';
const ROOT_PATH_DEPTH = 1;

const disableBackcapture =
  'standalone' in navigator && navigator['standalone' as keyof Navigator];

const $setPath = signal(flags.path.value || location.pathname);
flags.path.value = null;

export const setPath = (input: string): void => {
  $setPath.value = input;
};

const $setLeaveCallback = signal<(() => void) | null>(null);

export const setLeaveCallback = (
  input: (typeof $setLeaveCallback)['value'],
): void => {
  $setLeaveCallback.value = input;
};

export const $path = readOnly($setPath);

export const [$previousPath] = previous($path);

export const goPrevious = callbackUnwrapped(
  ({ previousPath }) => {
    if (!previousPath || getSegments(previousPath).length < ROOT_PATH_DEPTH) {
      return;
    }

    setPath(previousPath);
  },
  { previousPath: $previousPath },
);

export const $isRoot = computed(() => {
  const { value: path } = $path;

  return getSegments(path).length <= ROOT_PATH_DEPTH;
});

export const goUp = callbackUnwrapped(
  ({ isRoot, path }) => {
    if (isRoot) return;

    setPath(goUpUtil(path));
  },
  { isRoot: $isRoot, path: $path },
);

export const getSegment = callbackSignal(
  ({ path }, segmentNumber: number) => getSegments(path)[segmentNumber] || null,
  {
    path: $path,
  },
);

export const setSegment = callbackUnwrapped(
  ({ path }, segmentNumber: number) => {
    const segments = getSegments(path);
    if (segments.length < segmentNumber) return null;

    return (input: string | null) => {
      const segment = segments[segmentNumber];
      if (segment === input) return;

      const basePath = getPath(segments.slice(0, segmentNumber));
      setPath(input ? goDown(basePath, input) : basePath);
    };
  },
  { path: $path },
);

export const goRoot = callbackUnwrapped(
  ({ isRoot }) => {
    if (isRoot) return;

    const setter = setSegment(ROOT_PATH_DEPTH);
    if (!setter) return;

    setter(null);
  },
  { isRoot: $isRoot },
);

const onPopstate = callbackUnwrapped(
  ({ isRoot, leaveCallback, path }, { state }: PopStateEvent) => {
    if (disableBackcapture) return;
    if (state !== TRIGGER_STATE) return;

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
  {
    isRoot: $isRoot,
    leaveCallback: $setLeaveCallback,
    path: $path,
  },
);

effect(() => {
  const { value: path } = $path;

  history.replaceState(undefined, '', amend(path));
});

effect(() => {
  const { value: isVisible } = $isVisible;
  if (isVisible) return;

  goRoot();
});

window.addEventListener('popstate', onPopstate);

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

const PathContext = createContext(null as unknown as TPathContext);

export const PathProvider: FunctionComponent<{ rootPathDepth: number }> = ({
  children,
  rootPathDepth,
}) => {
  useHookDebug('PathProvider');

  const leaveCallbackRef = useRef<(() => void) | null>(null);

  const { value: isVisible } = $isVisible;
  const { value: pathFlag } = flags.path;

  const [path, setPath] = useState(() => {
    const result = pathFlag || location.pathname;
    flags.path.value = null;

    return result;
  });
  const [previousPath] = usePrevious(path);

  useEffect(() => {
    if (disableBackcapture) return;

    history.scrollRestoration = 'manual';

    history.replaceState(TRIGGER_STATE, '');
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
      if (state !== TRIGGER_STATE) return;

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
