import { Value, useUnwrapValue } from './main.js';
import { useMemo, useState } from 'preact/hooks';

export function useBreakpoint(breakpoint: Value): boolean {
  const value = useUnwrapValue(breakpoint);
  const mediaQuery = useMemo(() => matchMedia(value), [value]);

  const [matches, setMatches] = useState(mediaQuery.matches);

  mediaQuery.onchange = () => {
    setMatches(mediaQuery.matches);
  };

  return matches;
}

export function useBreakpointValue(
  breakpoint: Value,
  ifTrue: Value,
  ifFalse: Value
): string {
  const matches = useBreakpoint(breakpoint);

  const valueTrue = useUnwrapValue(ifTrue);
  const valueFalse = useUnwrapValue(ifFalse);

  return matches ? valueTrue : valueFalse;
}

export const breakpointValue = (
  breakpoint: Value,
  ifTrue: Value,
  ifFalse: Value
): (() => string) => {
  return () => useBreakpointValue(breakpoint, ifTrue, ifFalse);
};
