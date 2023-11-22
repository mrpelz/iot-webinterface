/* eslint-disable @typescript-eslint/no-explicit-any */

export type Value = string | (() => string);

export const useUnwrapValue = (value: Value): string =>
  value instanceof Function ? value() : value;

export const useDependentValue =
  <T extends any>(
    dependency: keyof T,
    ifTrue: string,
    ifFalse: string,
  ): ((props: T) => string) =>
  (props) =>
    props[dependency] ? ifTrue : ifFalse;

export const useMediaQuery = (value: string, negate?: boolean): string =>
  `${negate ? 'not ' : ''}screen and (min-width: ${value})`;

export const dependentValue =
  <T extends any>(
    dependency: keyof T,
    ifTrue: Value,
    ifFalse: Value,
  ): ((props: T) => string) =>
  (props) =>
    useDependentValue(
      dependency,
      useUnwrapValue(ifTrue),
      useUnwrapValue(ifFalse),
    )(props);

export const mediaQuery =
  (value: Value, negate?: boolean): (() => string) =>
  () =>
    useMediaQuery(useUnwrapValue(value), negate);

export const cssEnv = (variable: string, fallback?: string): string =>
  `env(${variable}${fallback ? `, ${fallback}` : ''})`;

export const cssVar = (variable: string, fallback?: string): string =>
  `var(--${variable}${fallback ? `, ${fallback}` : ''})`;
