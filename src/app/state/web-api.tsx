import { FunctionComponent, createContext } from 'preact';
import {
  HierarchyElement,
  HierarchyElementSystem,
  HierarchyElementWithMeta,
  Setter,
  WebApi,
  getElementsFromLevel,
} from '../web-api.js';
import { useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { useArray } from '../hooks/use-array-compare.js';
import { useHookDebug } from '../hooks/use-hook-debug.js';

export type SetterFunction<T> = (value: T) => void;

type UseLevelParents = (
  | HierarchyElement
  | null
  | (HierarchyElement | null)[]
)[];

type TWebApiContext = {
  hierarchy: HierarchyElementSystem | null;
  isStreamOnline: boolean;
  useGetterIndex: <T>(index?: number) => T | null;
  useSetterIndex: <T>(index?: number) => SetterFunction<T> | null;
};

const WebApiContext = createContext<TWebApiContext>({
  hierarchy: null,
  isStreamOnline: false,
  useGetterIndex: () => null,
  useSetterIndex: () => null,
});

// eslint-disable-next-line comma-spacing
const useGetterIndexFactory = <T,>(webApi: WebApi, index?: number) => {
  const [state, setState] = useState<T | null>(null);

  useEffect(() => {
    const getter =
      index === undefined
        ? null
        : webApi.createGetter<T>(index, (value) => setState(value));

    return () => getter?.remove();
  }, [index, webApi]);

  return state;
};

// eslint-disable-next-line comma-spacing
const useSetterIndexFactory = <T,>(webApi: WebApi, index?: number) => {
  const setter = useRef<Setter<T> | null>(null);

  useEffect(() => {
    setter.current = index === undefined ? null : webApi.createSetter<T>(index);

    return () => setter.current?.remove();
  }, [index, webApi]);

  return useMemo(() => {
    if (index === undefined) return null;
    return (value: T) => setter.current?.set(value);
  }, [index]);
};

export const WebApiProvider: FunctionComponent<{ webApi: WebApi }> = ({
  children,
  webApi,
}) => {
  useHookDebug('useInitWebApi');

  const [hierarchy, setHierarchy] = useState<HierarchyElementSystem>(
    null as unknown as HierarchyElementSystem
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

  return (
    <WebApiContext.Provider value={value}>{children}</WebApiContext.Provider>
  );
};

export const useWebApi = (): TWebApiContext => {
  return useContext(WebApiContext);
};

export const useHierarchy = (): TWebApiContext['hierarchy'] => {
  const { hierarchy } = useContext(WebApiContext);

  return useMemo(() => hierarchy, [hierarchy]);
};

const useLevel = <T extends HierarchyElementWithMeta>(
  level: T['meta']['level'],
  parents: UseLevelParents,
  deep?: boolean,
  skipInput?: boolean
) => {
  const memoizedParents = useArray(parents.flat());

  return useMemo(() => {
    return getElementsFromLevel<T>(memoizedParents, level, deep, skipInput);
  }, [deep, level, memoizedParents, skipInput]);
};

export const useLevelShallow = <T extends HierarchyElementWithMeta>(
  level: T['meta']['level'],
  ...parents: UseLevelParents
): T[] => {
  return useLevel(level, parents);
};

export const useLevelDeep = <T extends HierarchyElementWithMeta>(
  level: T['meta']['level'],
  ...parents: UseLevelParents
): T[] => {
  return useLevel(level, parents, true);
};

export const useLevelShallowSkipInput = <T extends HierarchyElementWithMeta>(
  level: T['meta']['level'],
  ...parents: UseLevelParents
): T[] => {
  return useLevel(level, parents, undefined, true);
};

export const useLevelDeepSkipInput = <T extends HierarchyElementWithMeta>(
  level: T['meta']['level'],
  ...parents: UseLevelParents
): T[] => {
  return useLevel(level, parents, true, true);
};

export const useElementFilter = <
  T extends HierarchyElementWithMeta,
  R extends T = T
>(
  input: T[],
  filter: (meta: T['meta']) => boolean
): R[] => {
  const memoizedInput = useArray(input);

  return useMemo(() => {
    return memoizedInput.filter(({ meta }) => filter(meta));
  }, [filter, memoizedInput]) as R[];
};

export const useChild = (
  input: HierarchyElement | null,
  child: string
): HierarchyElement | null => {
  return useMemo(() => {
    if (!input) return null;

    const { children } = input;
    if (!children) return null;

    const { [child]: childElement } = children;
    if (!childElement) return null;

    return childElement;
  }, [child, input]);
};

export const useStreamOnline = (): TWebApiContext['isStreamOnline'] => {
  const { isStreamOnline } = useContext(WebApiContext);

  return useMemo(() => isStreamOnline, [isStreamOnline]);
};

// eslint-disable-next-line comma-spacing
export const useGetter = <T,>(element: HierarchyElement | null): T | null => {
  const { useGetterIndex } = useContext(WebApiContext);

  return useGetterIndex(element?.get);
};

// eslint-disable-next-line comma-spacing
export const useChildGetter = <T,>(
  input: HierarchyElement | null,
  child: string
): T | null => {
  const { useGetterIndex } = useContext(WebApiContext);

  return useGetterIndex(useChild(input, child)?.get);
};

// eslint-disable-next-line comma-spacing
export const useSetter = <T,>(
  element: HierarchyElement | null
): SetterFunction<T> | null => {
  const { useSetterIndex } = useContext(WebApiContext);

  return useSetterIndex(element?.set);
};

// eslint-disable-next-line comma-spacing
export const useChildSetter = <T,>(
  input: HierarchyElement | null,
  child: string
): SetterFunction<T> | null => {
  const { useSetterIndex } = useContext(WebApiContext);

  return useSetterIndex(useChild(input, child)?.set);
};

export const useStreamCount = (): number | null => {
  const { useGetterIndex } = useContext(WebApiContext);

  return useGetterIndex(-1);
};
