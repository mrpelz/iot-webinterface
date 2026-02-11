import { ensureKeys, UnionToIntersection } from '@mrpelz/misc-utils/oop';

export const extractKey = <
  T extends object,
  K extends keyof UnionToIntersection<T>,
>(
  object: T,
  key: K,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Extract<T, Record<K, any>>[K] | undefined => ensureKeys(object, key)[key];
