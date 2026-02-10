import { ensureKeys, UnionToIntersection } from '@mrpelz/misc-utils/oop';
import { useMemo } from 'preact/hooks';

import { useArray } from './use-array-compare.js';

export const useEnsureKeys = <
  T extends object,
  K extends keyof UnionToIntersection<T>,
>(
  object?: T,
  ...keys: K[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Partial<Extract<T, Record<K, any>>> => {
  const keys_ = useArray(keys);

  return useMemo(
    () => (object ? ensureKeys(object, ...keys_) : {}),
    [keys_, object],
  );
};

export const useExtractKey = <
  T extends object,
  K extends keyof UnionToIntersection<T>,
>(
  object: T | undefined,
  key: K,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Extract<T, Record<K, any>>[K] | undefined =>
  useMemo(
    () => (object && key ? ensureKeys(object, key)[key] : undefined),
    [key, object],
  );
