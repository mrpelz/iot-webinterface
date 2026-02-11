export const unique = <T>(input: T[]): Exclude<T, undefined>[] =>
  Array.from(new Set(input)).filter((item): item is Exclude<T, undefined> =>
    Boolean(item),
  );

export const exclude = <T, E>(input: T[], excluded: E[]): Exclude<T, E>[] =>
  input.filter(
    (item): item is Exclude<T, E> => !excluded.includes(item as unknown as E),
  );
