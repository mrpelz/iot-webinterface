import { HierarchyNode, WebApi } from './main.js';
import { useContext, useEffect, useState } from 'preact/hooks';
import { createContext } from 'preact';

type SetterFunction<T> = (value: T) => void;

type TWebApiContext = {
  hierarchy: HierarchyNode;
  useGetterIndex: <T>(index?: number) => T | null;
  useSetterIndex: <T>(index?: number) => SetterFunction<T>;
};

export const WebApiContext = createContext<TWebApiContext>(
  null as unknown as TWebApiContext
);

export function useWebApiInsert(webApi: WebApi): TWebApiContext {
  const [hierarchy, setHierarchy] = useState<HierarchyNode>(
    null as unknown as HierarchyNode
  );

  useEffect(() => {
    webApi.onHierarchy((value) => setHierarchy(value));
  }, [webApi]);

  const useGetterIndex = <T>(index?: number) => {
    const [state, setState] = useState<T | null>(null);

    useEffect(() => {
      const getter =
        index === undefined
          ? null
          : webApi.createGetter<T>(index, (value) => setState(value));

      return () => getter?.remove();
    }, [index]);

    return state;
  };

  const useSetterIndex = <T>(index?: number) => {
    const [setterFn, setSetterFn] = useState<SetterFunction<T>>(() => () => {
      // eslint-disable-next-line no-console
      console.warn(
        `cannot send value for index ${index}, setter not yet ready`
      );
    });

    useEffect(() => {
      const setter = index === undefined ? null : webApi.createSetter<T>(index);

      setSetterFn(
        () => (value: T) =>
          setter?.set(value === undefined ? (null as unknown as T) : value)
      );

      return () => setter?.remove();
    }, [index]);

    return setterFn;
  };

  return {
    hierarchy,
    useGetterIndex,
    useSetterIndex,
  };
}

export function useGetter<T>({ get }: HierarchyNode): T | null {
  const { useGetterIndex } = useContext(WebApiContext);

  return useGetterIndex(get);
}

export function useSetter<T>({ set }: HierarchyNode): SetterFunction<T> {
  const { useSetterIndex } = useContext(WebApiContext);

  return useSetterIndex(set);
}
