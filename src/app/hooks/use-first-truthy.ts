import { useEffect, useState } from 'preact/hooks';

export const useTruthy = <T>(value?: T): T | undefined => {
  const [state, setState] = useState(value);

  useEffect(() => {
    if (!value) return;

    setState(value);
  }, [value]);

  return state;
};

export const useFirstTruthy = <T>(value?: T): T | undefined => {
  const [state, setState] = useState(value);

  useEffect(() => {
    if (!value) return;

    setState((oldValue) => oldValue ?? value);
  }, [value]);

  return state;
};
