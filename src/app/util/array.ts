import { isObject } from '@mrpelz/misc-utils/oop';

export const unique = <T>(input: T[]): Exclude<T, undefined>[] =>
  Array.from(new Set(input)).filter((item): item is Exclude<T, undefined> =>
    Boolean(item),
  );

export const uniqueById = <T>(input: T[]): Exclude<T, undefined>[] => {
  const items = unique(input);
  const result = new Map<string, Exclude<T, undefined>>();

  for (const item of items) {
    if (!isObject(item) || !('$id' in item)) continue;

    const id = item.$id;
    if (typeof id !== 'string') continue;
    if (result.has(id)) continue;

    result.set(id, item);
  }

  return Array.from(result.values());
};

export const exclude = <T, E>(input: T[], excluded: E[]): Exclude<T, E>[] =>
  input.filter(
    (item): item is Exclude<T, E> => !excluded.includes(item as unknown as E),
  );

export const excludeById = <T, E>(
  input: T[],
  excluded: E[],
): Exclude<T, E>[] => {
  const excludedItems = unique(excluded);
  const excludedIds = new Set<string>();

  for (const item of excludedItems) {
    if (!isObject(item) || !('$id' in item)) continue;

    const id = item.$id;
    if (typeof id !== 'string') continue;
    if (excludedIds.has(id)) continue;

    excludedIds.add(id);
  }

  const items = unique(input);
  const result = new Map<string, Exclude<T, E>>();

  for (const item of items) {
    if (!isObject(item) || !('$id' in item)) continue;

    const id = item.$id;
    if (typeof id !== 'string') continue;
    if (excludedIds.has(id)) continue;

    result.set(id, item as Exclude<T, E>);
  }

  return Array.from(result.values());
};
