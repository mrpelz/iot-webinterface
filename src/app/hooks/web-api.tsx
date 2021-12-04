import { FunctionComponent, createContext } from 'preact';
import { HierarchyElement, WebApi } from '../web-api.js';
import { useContext, useEffect, useMemo, useState } from 'preact/hooks';

type SetterFunction<T> = (value: T) => void;

type TWebApiContext = {
  hierarchy: HierarchyElement | null;
  isStreamOnline: boolean;
  useGetterIndex: <T>(index?: number) => T | null;
  useSetterIndex: <T>(index?: number) => SetterFunction<T>;
};

const WebApiContext = createContext<TWebApiContext>({
  hierarchy: null,
  isStreamOnline: false,
  useGetterIndex: () => null,
  useSetterIndex: () => () => undefined,
});

function useGetterIndexFactory<T>(webApi: WebApi, index?: number) {
  const [state, setState] = useState<T | null>(null);

  useEffect(() => {
    const getter =
      index === undefined
        ? null
        : webApi.createGetter<T>(index, (value) => setState(value));

    return () => getter?.remove();
  }, [index, webApi]);

  return state;
}

function useSetterIndexFactory<T>(webApi: WebApi, index?: number) {
  const [setterFn, setSetterFn] = useState<SetterFunction<T>>(() => () => {
    // eslint-disable-next-line no-console
    console.warn(`cannot send value for index ${index}, setter not yet ready`);
  });

  useEffect(() => {
    const setter = index === undefined ? null : webApi.createSetter<T>(index);

    setSetterFn(
      () => (value: T) =>
        setter?.set(value === undefined ? (null as unknown as T) : value)
    );

    return () => setter?.remove();
  }, [index, webApi]);

  return setterFn;
}

export function useInitWebApi(webApi: WebApi): FunctionComponent {
  const [hierarchy, setHierarchy] = useState<HierarchyElement>(
    null as unknown as HierarchyElement
  );

  const [isStreamOnline, setStreamOnline] = useState(false);

  useEffect(() => {
    webApi.onHierarchy((value) => {
      setHierarchy(value);
    });

    webApi.onStreamOnline((value) => setStreamOnline(value));
  }, [webApi]);

  const value = useMemo(
    () => ({
      hierarchy,
      isStreamOnline,
      // eslint-disable-next-line comma-spacing
      useGetterIndex: <T,>(index?: number) =>
        useGetterIndexFactory<T>(webApi, index),
      // eslint-disable-next-line comma-spacing
      useSetterIndex: <T,>(index?: number) =>
        useSetterIndexFactory<T>(webApi, index),
    }),
    [hierarchy, isStreamOnline, webApi]
  );

  return ({ children }) => (
    <WebApiContext.Provider value={value}>{children}</WebApiContext.Provider>
  );
}

export function useWebApi(): TWebApiContext {
  return useContext(WebApiContext);
}

export function useHierarchy(): TWebApiContext['hierarchy'] {
  const { hierarchy } = useWebApi();

  return useMemo(() => hierarchy, [hierarchy]);
}

export function useStreamOnline(): TWebApiContext['isStreamOnline'] {
  const { isStreamOnline } = useWebApi();

  return useMemo(() => isStreamOnline, [isStreamOnline]);
}

export function useGetter<T>({ get }: HierarchyElement): T | null {
  const { useGetterIndex } = useWebApi();

  return useGetterIndex(get);
}

export function useSetter<T>({ set }: HierarchyElement): SetterFunction<T> {
  const { useSetterIndex } = useWebApi();

  return useSetterIndex(set);
}
