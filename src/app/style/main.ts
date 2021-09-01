import { strings } from '../style.js';

export type Value = string | (() => string);

export type StringKeys = keyof typeof strings;

export function cssEnv(variable: string, fallback?: string): string {
  return `env(${variable}${fallback ? `, ${fallback}` : ''})`;
}

export function cssVar(variable: string, fallback?: string): string {
  return `var(--${variable}${fallback ? `, ${fallback}` : ''})`;
}

export function useString(id: StringKeys): string {
  return strings[id];
}

export function useUnwrapValue(value: Value): string {
  return value instanceof Function ? value() : value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDependentValue<T extends any>(
  dependency: keyof T,
  ifTrue: Value,
  ifFalse: Value
): (props: T) => string {
  const valueTrue = useUnwrapValue(ifTrue);
  const valueFalse = useUnwrapValue(ifFalse);

  return (props) => (props[dependency] ? valueTrue : valueFalse);
}

export function useMediaQuery(_value: Value, negate?: boolean): string {
  const unwrappedWidth = useUnwrapValue(_value);

  return `${negate ? 'not ' : ''}screen and (min-width: ${unwrappedWidth})`;
}

export const string = (id: StringKeys): (() => string) => {
  return () => useString(id);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dependentValue = <T extends any>(
  dependency: keyof T,
  ifTrue: Value,
  ifFalse: Value
): ((props: T) => string) => {
  return (props) => useDependentValue(dependency, ifTrue, ifFalse)(props);
};

export const mediaQuery = (_value: Value, negate?: boolean): (() => string) => {
  return () => useMediaQuery(_value, negate);
};
