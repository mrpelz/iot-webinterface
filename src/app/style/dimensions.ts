import { Value, useUnwrapValue } from './main.js';
import { dimensions } from '../style.js';

export type DimensionKeys = keyof typeof dimensions;

export function useDimension(id: DimensionKeys): string {
  return `${dimensions[id].toString(10)}px`;
}

export function useAddition(...inputs: Value[]): string {
  const results: string[] = [];

  for (const input of inputs) {
    // it is okay to call the hook function within a loop in this case
    // eslint-disable-next-line react-hooks/rules-of-hooks
    results.push(useUnwrapValue(input));
  }

  return `calc(${results.join(' + ')})`;
}

export function useSubtraction(...inputs: Value[]): string {
  const results: string[] = [];

  for (const input of inputs) {
    // it is okay to call the hook function within a loop in this case
    // eslint-disable-next-line react-hooks/rules-of-hooks
    results.push(useUnwrapValue(input));
  }

  return `calc(${results.join(' - ')})`;
}

export const dimension = (id: DimensionKeys): (() => string) => {
  return () => useDimension(id);
};

export const add = (...inputs: Value[]): (() => string) => {
  return () => useAddition(...inputs);
};

export const subtract = (...inputs: Value[]): (() => string) => {
  return () => useSubtraction(...inputs);
};
