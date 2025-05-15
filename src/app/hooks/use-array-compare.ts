import { useEffect, useState } from 'preact/hooks';

export const useArray = <E, T extends E[] | null>(value: T): T => {
  const [state, setState] = useState(value);

  useEffect(() => {
    if (state === value) return;

    if (!Array.isArray(state) || !Array.isArray(value)) {
      setState(value);
      return;
    }

    if (value.length !== state.length) {
      setState(value);
      return;
    }

    for (let index = 0; index < value.length; index += 1) {
      const oldElement = state[index];
      const newElement = value[index];

      if (oldElement !== newElement) {
        setState(value);
        return;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return state;
};
