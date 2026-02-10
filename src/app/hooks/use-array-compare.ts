import { useEffect, useMemo, useState } from 'preact/hooks';

export const useArray = <E, T extends E[] | undefined>(value: T): T => {
  const [state, setState] = useState(value);

  useEffect(() => {
    if (state === value) return;

    if (!Array.isArray(state) || !Array.isArray(value)) {
      setState(value);
      return;
    }

    if (value.length !== state.length) {
      setState(value);
      return;
    }

    for (let index = 0; index < value.length; index += 1) {
      const oldElement = state[index];
      const newElement = value[index];

      if (oldElement !== newElement) {
        setState(value);
        return;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return state;
};

export const useArrayUnique = <E, T extends E[]>(
  value: T | undefined,
): Exclude<T[number], undefined>[] | undefined => {
  const memoizedArray = useArray(value);

  return useMemo(() => {
    if (!memoizedArray) return undefined;

    return Array.from(new Set(memoizedArray)).filter(Boolean);
  }, [memoizedArray]) as Exclude<T[number], undefined>[] | undefined;
};

export const useArrayExclude = <E, T extends E[]>(
  value: T | undefined,
  exclude: unknown[],
): Exclude<T[number], undefined>[] | undefined => {
  const memoizedArray = useArrayUnique(value);
  const memoizedExclude = useArrayUnique(exclude);

  return useMemo(
    () =>
      memoizedArray?.filter(
        (item) => memoizedExclude && !memoizedExclude.includes(item),
      ),
    [memoizedArray, memoizedExclude],
  ) as Exclude<T[number], undefined>[] | undefined;
};
