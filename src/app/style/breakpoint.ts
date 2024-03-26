import { computed, effect, ReadonlySignal, signal } from '@preact/signals';
import { useEffect, useMemo, useState } from 'preact/hooks';

import { readOnly } from '../util/signal.js';
import { useUnwrapValue, Value } from './main.js';

export const useBreakpoint = (breakpoint: string): boolean => {
  const mediaQuery = useMemo(() => matchMedia(breakpoint), [breakpoint]);

  const [matches, setMatches] = useState(mediaQuery.matches);

  useEffect(() => {
    const handleMediaQueryChange = () => setMatches(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () =>
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
  }, [mediaQuery]);

  return matches;
};

export const breakpoint = (query: string): ReadonlySignal<boolean> => {
  const mediaQuery = matchMedia(query);

  const matches = signal(mediaQuery.matches);

  effect(() => {
    const handleMediaQueryChange = () => (matches.value = mediaQuery.matches);

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () =>
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
  });

  return readOnly(matches);
};

export const useBreakpointValue = (
  query: string,
  ifTrue: string,
  ifFalse: string,
): string => {
  const matches = useBreakpoint(query);

  return matches ? ifTrue : ifFalse;
};

export const $breakpointValue = (
  query: string,
  ifTrue: string,
  ifFalse: string,
): ReadonlySignal<string> =>
  computed(() => (breakpoint(query) ? ifTrue : ifFalse));

export const breakpointValue =
  (query: Value, ifTrue: Value, ifFalse: Value): (() => string) =>
  () =>
    useBreakpointValue(
      useUnwrapValue(query),
      useUnwrapValue(ifTrue),
      useUnwrapValue(ifFalse),
    );
