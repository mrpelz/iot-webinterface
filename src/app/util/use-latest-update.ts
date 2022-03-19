import { useEffect, useState } from 'preact/hooks';

export const useLatestUpdate = <T>(first: T, ...inputs: T[]): T => {
  const [state, setState] = useState(first);

  useEffect(() => {
    setState(first);
  }, [first]);

  for (const input of inputs) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setState(input);
    }, [input]);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return state;
};
