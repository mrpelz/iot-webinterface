import { useEffect, useMemo } from 'preact/hooks';

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
