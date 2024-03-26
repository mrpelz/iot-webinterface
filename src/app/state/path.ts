import { computed, effect, signal } from '@preact/signals';

import { previous } from '../signals/previous.js';
import { flags } from '../util/flags.js';
import {
  amend,
  getPath,
  getSegments,
  goDown,
  goUp as goUpUtil,
} from '../util/path.js';
import {
  callbackSignal,
  callbackUnwrapped,
  getSignal,
  readOnly,
} from '../util/signal.js';
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
  const path = getSignal($path);

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

export const setSegment = callbackSignal(
  ({ path }, segmentNumber: number) => {
    const segments = getSegments(path);

    if (segments.length < segmentNumber) return () => undefined;

    const segment = segments[segmentNumber];

    return (input: string | null) => {
      if (segment === input) return;

      const basePath = getPath(segments.slice(0, segmentNumber));
      setPath(input ? goDown(basePath, input) : basePath);
    };
  },
  { path: $path },
);

export const $rootPath = getSegment(0);
export const $setRootPath = setSegment(0);

export const $subPath = getSegment(1);
export const $setSubPath = setSegment(1);

export const goRoot = callbackUnwrapped(
  ({ isRoot }) => {
    if (isRoot) return;

    getSignal($setSubPath)(null);
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
  const path = getSignal($path);

  history.replaceState(undefined, '', amend(path));
});

effect(() => {
  const isVisible = getSignal($isVisible);
  if (isVisible) return;

  goRoot();
});

window.addEventListener('popstate', onPopstate);
