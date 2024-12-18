import { useMemo } from 'preact/hooks';

export const useSymbol = (): symbol =>
  useMemo(
    () => Symbol(Math.trunc(Math.random() * 10_000_000).toString(16)),
    [],
  );
