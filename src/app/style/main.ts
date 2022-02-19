export type Value = string | (() => string);

export const useUnwrapValue = (value: Value): string => {
  return value instanceof Function ? value() : value;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDependentValue = <T extends any>(
  dependency: keyof T,
  ifTrue: string,
  ifFalse: string
): ((props: T) => string) => {
  return (props) => (props[dependency] ? ifTrue : ifFalse);
};

export const useMediaQuery = (value: string, negate?: boolean): string => {
  return `${negate ? 'not ' : ''}screen and (min-width: ${value})`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dependentValue = <T extends any>(
  dependency: keyof T,
  ifTrue: Value,
  ifFalse: Value
): ((props: T) => string) => {
  return (props) =>
    useDependentValue(
      dependency,
      useUnwrapValue(ifTrue),
      useUnwrapValue(ifFalse)
    )(props);
};

export const mediaQuery =
  (value: Value, negate?: boolean): (() => string) =>
  () =>
    useMediaQuery(useUnwrapValue(value), negate);

export const cssEnv = (variable: string, fallback?: string): string => {
  return `env(${variable}${fallback ? `, ${fallback}` : ''})`;
};

export const cssVar = (variable: string, fallback?: string): string => {
  return `var(--${variable}${fallback ? `, ${fallback}` : ''})`;
};
