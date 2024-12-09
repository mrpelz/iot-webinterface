import { useEffect, useState } from 'preact/hooks';

export const usePromise = <T>(input: () => Promise<T>): T | undefined => {
  const [state, setState] = useState<T | undefined>(undefined);

  useEffect(() => {
    (async () => {
      setState(await input());
    })();
  }, [input]);

  return state;
};
