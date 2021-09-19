import { FunctionComponent, createContext } from 'preact';
import { HierarchyElement, WebApi } from '../web-api.js';
import { useContext, useEffect, useState } from 'preact/hooks';

type SetterFunction<T> = (value: T) => void;

type TWebApiContext = {
  hierarchy: HierarchyElement | null;
  streamOnline: boolean;
  useGetterIndex: <T>(index?: number) => T | null;
  useSetterIndex: <T>(index?: number) => SetterFunction<T>;
};

const HIERARCHY_STORAGE_KEY = 'webApiHierarchy';

const WebApiContext = createContext<TWebApiContext>({
  hierarchy: null,
  streamOnline: false,
  useGetterIndex: () => null,
  useSetterIndex: () => () => undefined,
});

export function useInitWebApi(webApi: WebApi): FunctionComponent {
  const initialHierarchy = (() => {
    try {
      const payload = localStorage.getItem(HIERARCHY_STORAGE_KEY);
      if (!payload) return null;

      const parsed = JSON.parse(payload);
      if (typeof parsed !== 'object') return null;

      return parsed as HierarchyElement;
    } catch {
      return null;
    }
  })();

  const [hierarchy, setHierarchy] = useState<HierarchyElement>(
    initialHierarchy as unknown as HierarchyElement
  );

  const [streamOnline, setStreamOnline] = useState(false);

  useEffect(() => {
    webApi.onHierarchy((value) => {
      setHierarchy(value);

      localStorage.setItem(HIERARCHY_STORAGE_KEY, JSON.stringify(value));
    });

    webApi.onStreamOnline((value) => {
      setStreamOnline(value);
    });
  }, [webApi]);

  // eslint-disable-next-line comma-spacing
  const useGetterIndex = <T,>(index?: number) => {
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

  // eslint-disable-next-line comma-spacing
  const useSetterIndex = <T,>(index?: number) => {
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

  return ({ children }) => (
    <WebApiContext.Provider
      value={{
        hierarchy,
        streamOnline,
        useGetterIndex,
        useSetterIndex,
      }}
    >
      {children}
    </WebApiContext.Provider>
  );
}

export function useWebApi(): TWebApiContext {
  return useContext(WebApiContext);
}

export function useGetter<T>({ get }: HierarchyElement): T | null {
  const { useGetterIndex } = useWebApi();

  return useGetterIndex(get);
}

export function useSetter<T>({ set }: HierarchyElement): SetterFunction<T> {
  const { useSetterIndex } = useWebApi();

  return useSetterIndex(set);
}
