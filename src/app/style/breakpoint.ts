import { Value, useUnwrapValue } from './main.js';
import { useMemo, useState } from 'preact/hooks';

export function useBreakpoint(breakpoint: string): boolean {
  const mediaQuery = useMemo(() => matchMedia(breakpoint), [breakpoint]);

  const [matches, setMatches] = useState(mediaQuery.matches);

  mediaQuery.onchange = () => {
    setMatches(mediaQuery.matches);
  };

  return matches;
}

export function useBreakpointValue(
  breakpoint: string,
  ifTrue: string,
  ifFalse: string
): string {
  const matches = useBreakpoint(breakpoint);

  return matches ? ifTrue : ifFalse;
}

export const breakpointValue = (
  breakpoint: Value,
  ifTrue: Value,
  ifFalse: Value
): (() => string) => {
  return () =>
    useBreakpointValue(
      useUnwrapValue(breakpoint),
      useUnwrapValue(ifTrue),
      useUnwrapValue(ifFalse)
    );
};
