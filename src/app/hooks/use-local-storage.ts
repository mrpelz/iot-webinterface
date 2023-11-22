import { useEffect, useMemo } from 'preact/hooks';

export const useGetLocalStorage = (key: string): string | null =>
  useMemo(() => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }, [key]);

export const useSetLocalStorage = (key: string, value: string | null): void => {
  useEffect(() => {
    try {
      if (value === null) {
        localStorage.removeItem(key);
        return;
      }

      localStorage.setItem(key, value);
    } catch {
      // noop
    }
  }, [key, value]);
};
