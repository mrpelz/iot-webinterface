import { objectKeys } from '@iot/iot-monolith/oop';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (
  x: infer I,
) => void
  ? I
  : never;

export const ensureKeys = <
  T extends object,
  K extends keyof UnionToIntersection<T>,
>(
  object: T,
  ...keys: K[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Extract<T, Record<K, any>> => {
  const keys_ = [keys, objectKeys(object)].flat();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = {} as Extract<T, Record<K, any>>;

  for (const key of keys_) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result[key] = object[key];
  }

  return result;
};
