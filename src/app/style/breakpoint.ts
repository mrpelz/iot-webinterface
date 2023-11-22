import { useEffect, useMemo, useState } from 'preact/hooks';

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

export const useBreakpointValue = (
  breakpoint: string,
  ifTrue: string,
  ifFalse: string,
): string => {
  const matches = useBreakpoint(breakpoint);

  return matches ? ifTrue : ifFalse;
};

export const breakpointValue =
  (breakpoint: Value, ifTrue: Value, ifFalse: Value): (() => string) =>
  () =>
    useBreakpointValue(
      useUnwrapValue(breakpoint),
      useUnwrapValue(ifTrue),
      useUnwrapValue(ifFalse),
    );
