import { useRef } from 'preact/hooks';

export const useIsFirstRender = (): boolean => {
  const ref = useRef(true);
  const firstRender = ref.current;
  ref.current = false;

  return firstRender;
};
