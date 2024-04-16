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
  ...0[],
];

export type DeepRemap<T extends object, S, R, D extends number = 20> = [
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

export type DeepValuesInclusive<T, D extends number = 20> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: T[K] | DeepValuesInclusive<T[K], Prev[D]>;
      }[keyof T]
    : T;
