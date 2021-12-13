import { StateUpdater, useEffect, useState } from 'preact/hooks';

export const persistentState = <T>(): ((
  initialValue: T | (() => T)
) => [T, StateUpdater<T>]) => {
  let persist: T;

  return (initialValue) => {
    const [state, setState] = useState(
      persist === undefined ? initialValue : () => persist
    );

    useEffect(() => {
      persist = state;
    }, [state]);

    return [state, setState];
  };
};
