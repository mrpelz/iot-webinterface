import { useCallback, useEffect, useRef, useState } from 'preact/hooks';

export const useAwaitEvent = (
  state: boolean,
  eventResolves: boolean,
  expectCalls = 1
): [boolean, () => void] => {
  const [innerState, setInnerState] = useState(state);
  const remainingCalls = useRef(expectCalls);

  useEffect(() => {
    remainingCalls.current = expectCalls;
    if (state === eventResolves) return;

    setInnerState(state);
  }, [eventResolves, expectCalls, state]);

  const handleEvent = useCallback(() => {
    if (state !== eventResolves) return;

    remainingCalls.current -= 1;
    if (remainingCalls.current) return;

    setInnerState(eventResolves);
  }, [eventResolves, state]);

  return [innerState, handleEvent];
};
