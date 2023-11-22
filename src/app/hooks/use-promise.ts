import { useEffect, useState } from 'preact/hooks';

export const usePromise = <T>(input: () => Promise<T>): T | null => {
  const [state, setState] = useState<T | null>(null);

  useEffect(() => {
    (async () => {
      setState(await input());
    })();
  }, [input]);

  return state;
};
