export type ObjectValues<T extends object> = T[keyof T];

export type NoUndefinedField<T> = {
  [Key in keyof T]-?: NoUndefinedField<NonNullable<T[Key]>>;
};

export type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  ...0[],
];

export type DeepRemap<T extends object, S, R, D extends number = 50> = [
  D,
] extends [never]
  ? never
  : {
      [K in keyof T]: T[K] extends S
        ? R
        : T[K] extends object
          ? DeepRemap<T[K], S, R, Prev[D]>
          : T[K];
    };

export type DeepValuesInclusive<T, D extends number = 50> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: T[K] | DeepValuesInclusive<T[K], Prev[D]>;
      }[keyof T]
    : T;

export const isObject = (input: unknown): input is object => {
  if (typeof input !== 'object') return false;
  if (!input) return false;

  return true;
};

export const objectKeys = <T extends object>(input: T): (keyof T)[] => [
  ...(Object.getOwnPropertySymbols(input) as unknown as (keyof T)[]),
  ...(Object.getOwnPropertyNames(input) as unknown as (keyof T)[]),
];

export const objectValues = <T extends object>(input: T): ObjectValues<T>[] =>
  objectKeys(input).map((property) => input[property]);

export const resolve = <
  T extends unknown,
  Q extends (string | number | symbol)[],
>(
  input: T,
  ...query: Q
): Partial<Extract<Required<T>, Record<Q[number], unknown>>> => {
  if (!isObject(input)) return {};

  return Object.fromEntries(
    Object.entries(input).filter(([key]) => query.includes(key)),
  ) as Extract<Required<T>, Record<Q[number], unknown>>;
};
