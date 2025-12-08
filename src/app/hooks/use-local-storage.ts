import {
  Dispatch,
  StateUpdater,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';

import { useSafeJSONStringify } from './use-safe-json-stringify.js';

export const useGetLocalStorage = (key: string): string | undefined =>
  useMemo(() => {
    try {
      return localStorage.getItem(key) ?? undefined;
    } catch {
      return undefined;
    }
  }, [key]);

export const useSetLocalStorage = (key: string, value?: string): void => {
  useEffect(() => {
    try {
      if (value === undefined) {
        localStorage.removeItem(key);
        return;
      }

      localStorage.setItem(key, value);
    } catch {
      // noop
    }
  }, [key, value]);
};

export const useLocalStorage = <T>(
  key: string,
  defaultValue?: T,
): [T | undefined, Dispatch<StateUpdater<T | undefined>>] => {
  const persisted_ = useGetLocalStorage(key);
  const persisted = useMemo(() => {
    if (persisted_ === undefined) return undefined;

    try {
      return JSON.parse(persisted_);
    } catch {
      return undefined;
    }
  }, [persisted_]) as T | undefined;

  const [value, setValue] = useState<T | undefined>(persisted ?? defaultValue);

  useSetLocalStorage(key, useSafeJSONStringify(value));

  return [value, setValue];
};
