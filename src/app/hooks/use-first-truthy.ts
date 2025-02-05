import { useEffect, useState } from 'preact/hooks';

export const useFirstTruthy = <T>(value?: T): T | undefined => {
  const [state, setState] = useState(value);

  useEffect(() => {
    if (!value) return;

    setState(value);
  }, [value]);

  return state;
};
