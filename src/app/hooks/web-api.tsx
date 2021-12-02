import { FunctionComponent, createContext } from 'preact';
import { HierarchyElement, WebApi } from '../web-api.js';
import { useContext, useEffect, useMemo, useState } from 'preact/hooks';

type SetterFunction<T> = (value: T) => void;

type TWebApiContext = {
  hierarchy: HierarchyElement | null;
  useGetterIndex: <T>(index?: number) => T | null;
  useSetterIndex: <T>(index?: number) => SetterFunction<T>;
};

const WebApiContext = createContext<TWebApiContext>({
  hierarchy: null,
  useGetterIndex: () => null,
  useSetterIndex: () => () => undefined,
});
const StreamOnlineContext = createContext(false);

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

const WebApiProvider: FunctionComponent<{ webApi: WebApi }> = ({
  children,
  webApi,
}) => {
  const [hierarchy, setHierarchy] = useState<HierarchyElement>(
    null as unknown as HierarchyElement
  );

  useEffect(() => {
    webApi.onHierarchy((value) => {
      setHierarchy(value);
    });
  }, [webApi]);

  const value = useMemo(
    () => ({
      hierarchy,
      // eslint-disable-next-line comma-spacing
      useGetterIndex: <T,>(index?: number) =>
        useGetterIndexFactory<T>(webApi, index),
      // eslint-disable-next-line comma-spacing
      useSetterIndex: <T,>(index?: number) =>
        useSetterIndexFactory<T>(webApi, index),
    }),
    [hierarchy, webApi]
  );

  return (
    <WebApiContext.Provider value={value}>{children}</WebApiContext.Provider>
  );
};

const StreamOnlineProvider: FunctionComponent<{ webApi: WebApi }> = ({
  children,
  webApi,
}) => {
  const [streamOnline, setStreamOnline] = useState(false);

  useEffect(() => {
    webApi.onStreamOnline((value) => setStreamOnline(value));
  }, [webApi]);

  return (
    <StreamOnlineContext.Provider value={streamOnline}>
      {children}
    </StreamOnlineContext.Provider>
  );
};

export function useInitWebApi(webApi: WebApi): FunctionComponent {
  return ({ children }) => (
    <WebApiProvider webApi={webApi}>
      <StreamOnlineProvider webApi={webApi}>{children}</StreamOnlineProvider>
    </WebApiProvider>
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

export function useStreamOnline(): boolean {
  return useContext(StreamOnlineContext);
}
