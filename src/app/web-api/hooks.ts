import { HierarchyChildren, HierarchyElement, Meta, WebApi } from './main.js';
import { useContext, useEffect, useState } from 'preact/hooks';
import { createContext } from 'preact';

type SetterFunction<T> = (value: T) => void;

type TWebApiContext = {
  hierarchy: HierarchyElement;
  useGetter: <T>(index: number) => T | null;
  useSetter: <T>(index: number) => SetterFunction<T>;
};

export type WebApiNode = {
  children: HierarchyChildren;
  getterIndex: number | null;
  meta: Meta;
  setterIndex: number | null;
  useGetter: <T>() => T | null;
  useSetter: <T>() => SetterFunction<T>;
};

export const WebApiContext = createContext<TWebApiContext>(
  null as unknown as TWebApiContext
);

export const useWebApiInsert = (webApi: WebApi): TWebApiContext => {
  const [hierarchy, setHierarchy] = useState<HierarchyElement>(
    null as unknown as HierarchyElement
  );

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
    const [setterFn, setSetterFn] = useState<SetterFunction<T>>(() => () => {
      // eslint-disable-next-line no-console
      console.warn(
        `cannot send value for index ${index}, setter not yet ready`
      );
    });

    useEffect(() => {
      const setter = webApi.createSetter<T>(index);
      setSetterFn(
        () => (value: T) =>
          setter?.set(value === undefined ? (null as unknown as T) : value)
      );

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

export const useWebApi = (): TWebApiContext => useContext(WebApiContext);

export const useWebApiNode = (node: HierarchyElement): WebApiNode => {
  const { useGetter, useSetter } = useWebApi();

  return {
    children: Object.fromEntries(
      Object.entries(node).filter(
        ([key]) => !['_get', '_meta', '_set'].includes(key)
      )
    ),
    getterIndex: '_get' in node ? (node._get as number) : null,
    meta: node._meta,
    setterIndex: '_set' in node ? (node._set as number) : null,
    useGetter: <T>() => {
      return '_get' in node ? useGetter<T>(node._get as number) : null;
    },
    useSetter: <T>() => {
      return '_set' in node ? useSetter<T>(node._set as number) : () => null;
    },
  };
};
