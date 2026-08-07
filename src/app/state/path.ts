import { computed, effect, signal } from '@preact/signals';

import { $flags } from '../util/flags.js';
import {
  amend,
  getPath,
  getSegments,
  goDown,
  goUp as goUpUtil,
} from '../util/path.js';
import { callbackSignal, previous, readOnly } from '../util/signal.js';
import { isPWA } from '../util/useragent.js';
import { setMenuVisible } from './menu.js';
import { $isVisible } from './visibility.js';

const TRIGGER_STATE = 'c0aab99b-77e0-45c8-ab13-7effa083bc19';
const ROOT_PATH_DEPTH = 1;

const enableBackcapture = !isPWA;

const $setPath = signal($flags.path.value ?? '');
$flags.path.value = null;

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

export const goPrevious = (): void => {
  const previousPath = $previousPath.value;
  if (!previousPath || getSegments(previousPath).length < ROOT_PATH_DEPTH) {
    return;
  }

  setPath(previousPath);
};

export const $segments = computed(() => getSegments($path.value));
export const $pathDepth = computed(() => $segments.value.length);
export const $isRoot = computed(() => $pathDepth.value <= ROOT_PATH_DEPTH);

export const goUp = (): void => {
  if ($isRoot.value) return;

  setPath(goUpUtil($path.value));
};

export const getSegment = callbackSignal(
  ({ path }, segmentNumber: number) =>
    getSegments(path)[segmentNumber] || undefined,
  {
    path: $path,
  },
);

export const setSegment =
  (segmentNumber: number) =>
  (input?: string): void => {
    const segments = $segments.value;

    if (segments.length < segmentNumber) return;

    const segment = segments[segmentNumber];
    if (segment === input) return;

    const basePath = getPath(segments.slice(0, segmentNumber));
    setPath(input ? goDown(basePath, input) : basePath);
  };

export const $rootPath = getSegment(0);
export const setRootPath = setSegment(0);

export const $subPath = getSegment(1);
export const setSubPath = (input?: string, level?: number): void =>
  setSegment(level ?? $pathDepth.value)(input);

export const goRoot = (): void => {
  if ($isRoot.value) return;

  setSubPath(undefined);
};

effect(() => {
  if ($isVisible.value) return;

  goRoot();
});

effect(() => {
  if (!$path.value) return;

  history.replaceState(undefined, '', amend($path.value).pathname);
});

addEventListener('popstate', () => {
  if ($isRoot.value) {
    if (enableBackcapture) {
      setMenuVisible(true);
    }

    history.replaceState(undefined, '', amend($path.value).pathname);

    return;
  }

  goUp();
});

const initialPath = location.pathname;
history.replaceState(TRIGGER_STATE, '', '/');
history.pushState(undefined, '', '/');

setPath(initialPath);
