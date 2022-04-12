import { FunctionComponent, createContext } from 'preact';
import {
  HierarchyElement,
  HierarchyElementSystem,
  HierarchyElementWithMeta,
  WebApi,
  getElementsFromLevel,
} from '../web-api.js';
import { useContext, useEffect, useMemo, useState } from 'preact/hooks';
import { useArray } from '../util/use-array-compare.js';
import { useHookDebug } from '../util/use-hook-debug.js';

type SetterFunction<T> = (value: T) => void;

type UseLevelParents = (
  | HierarchyElement
  | null
  | (HierarchyElement | null)[]
)[];

type TWebApiContext = {
  hierarchy: HierarchyElementSystem | null;
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

export const useElementFilter = <T extends HierarchyElementWithMeta>(
  filter: (meta: T['meta']) => boolean,
  input: T[]
): T[] | null => {
  const memoizedInput = useArray(input);

  return useMemo(() => {
    return memoizedInput.filter(({ meta }) => filter(meta));
  }, [filter, memoizedInput]);
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
export const useSetter = <T,>(
  element: HierarchyElement | null
): SetterFunction<T> => {
  const { useSetterIndex } = useContext(WebApiContext);

  return useSetterIndex(element?.set);
};

export const useStreamCount = (): number | null => {
  const { useGetterIndex } = useContext(WebApiContext);

  return useGetterIndex(-1);
};
