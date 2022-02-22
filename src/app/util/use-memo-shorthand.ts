import { useMemo } from 'preact/hooks';

export const useMemoShorthand = <T, S>(
  value: T,
  handler: (input: T) => S
): S => {
  return useMemo(() => {
    return handler(value);
  }, [handler, value]);
};
