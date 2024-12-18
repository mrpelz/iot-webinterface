import { useCallback, useState } from 'preact/hooks';

export const useRerender = (
  label: string,
): [symbol | undefined, () => void] => {
  const [state, setState] = useState<symbol | undefined>(undefined);
  const rerender = useCallback(() => setState(Symbol(label)), [label]);

  return [state, rerender];
};
