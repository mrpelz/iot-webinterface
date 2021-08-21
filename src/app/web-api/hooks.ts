import { useEffect, useState } from 'preact/hooks';
import { WebApi } from './main.js';
import { createContext } from 'preact';

type WebApiContextType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hierarchy: any;
  useGetter: <T>(index: number) => T | null;
  useSetter: <T>(index: number) => (value: T) => void;
};

export const WebApiContext = createContext<WebApiContextType>(
  null as unknown as WebApiContextType
);

export const useWebApi = (webApi: WebApi): WebApiContextType => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [hierarchy, setHierarchy] = useState<any>(null);

  useEffect(() => {
    (async () => {
      setHierarchy(await webApi.hierarchy);
    })();
  }, [webApi]);

  const useGetter = <T>(index: number) => {
    const [state, setState] = useState<T | null>(null);

    useEffect(() => {
      const getter = webApi.createGetter<T>(index, (value) => setState(value));

      return () => getter?.remove();
    }, [webApi]);

    return state;
  };

  const useSetter = <T>(index: number) => {
    const [setterFn, setSetterFn] = useState<(value: T) => void>(() => () => {
      // eslint-disable-next-line no-console
      console.warn(
        `cannot send value for index ${index}, setter not yet ready`
      );
    });

    useEffect(() => {
      const setter = webApi.createSetter<T>(index);
      setSetterFn(() => (value: T) => setter?.set(value));

      return () => setter?.remove();
    }, [webApi]);

    return setterFn;
  };

  return {
    hierarchy,
    useGetter,
    useSetter,
  };
};
