import { createContext, FunctionComponent } from 'preact';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';

import { useArray } from '../hooks/use-array-compare.js';
import { useHookDebug } from '../hooks/use-hook-debug.js';
import {
  getElementsFromLevel,
  HierarchyElement,
  HierarchyElementSystem,
  HierarchyElementWithMeta,
  Setter,
  WebApi,
} from '../web-api.js';

export type SetterFunction<T> = (value: T) => void;

type UseLevelParents = (
  | HierarchyElement
  | null
  | (HierarchyElement | null)[]
)[];

type TWebApiContext = {
  elements: HierarchyElement[] | null;
  hierarchy: HierarchyElementSystem | null;
  isStreamOnline: boolean;
  useGetterIndex: <T>(index?: number) => T | null;
  useSetterIndex: <T>(index?: number) => SetterFunction<T> | null;
};

const WebApiContext = createContext<TWebApiContext>({
  elements: null,
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
    null as unknown as HierarchyElementSystem,
  );

  const [elements, setElements] = useState<HierarchyElement[]>(
    null as unknown as HierarchyElement[],
  );

  const [isStreamOnline, setStreamOnline] = useState(false);

  useEffect(() => {
    webApi.onHierarchy((hierarchyInput, elementsInput) => {
      setHierarchy(hierarchyInput);
      setElements(elementsInput);
    });

    webApi.onStreamOnline((value) => setStreamOnline(value));
  }, [webApi]);

  const value = useMemo(
    () => ({
      elements,
      hierarchy,
      isStreamOnline,
      // eslint-disable-next-line comma-spacing
      useGetterIndex: <T,>(index?: number) =>
        useGetterIndexFactory<T>(webApi, index),
      // eslint-disable-next-line comma-spacing
      useSetterIndex: <T,>(index?: number) =>
        useSetterIndexFactory<T>(webApi, index),
    }),
    [elements, hierarchy, isStreamOnline, webApi],
  );

  return (
    <WebApiContext.Provider value={value}>{children}</WebApiContext.Provider>
  );
};

export const useWebApi = (): TWebApiContext => useContext(WebApiContext);

export const useHierarchy = (): TWebApiContext['hierarchy'] => {
  const { hierarchy } = useContext(WebApiContext);

  return useMemo(() => hierarchy, [hierarchy]);
};

export const useElements = (): TWebApiContext['elements'] => {
  const { elements } = useContext(WebApiContext);

  return useMemo(() => elements, [elements]);
};

const useLevel = <T extends HierarchyElementWithMeta>(
  level: T['meta']['level'],
  parents: UseLevelParents,
  deep?: boolean,
  skipInput?: boolean,
) => {
  const memoizedParents = useArray(parents.flat());

  return useMemo(
    () => getElementsFromLevel<T>(memoizedParents, level, deep, skipInput),
    [deep, level, memoizedParents, skipInput],
  );
};

export const useLevelShallow = <T extends HierarchyElementWithMeta>(
  level: T['meta']['level'],
  ...parents: UseLevelParents
): T[] => useLevel(level, parents);

export const useLevelDeep = <T extends HierarchyElementWithMeta>(
  level: T['meta']['level'],
  ...parents: UseLevelParents
): T[] => useLevel(level, parents, true);

export const useLevelShallowSkipInput = <T extends HierarchyElementWithMeta>(
  level: T['meta']['level'],
  ...parents: UseLevelParents
): T[] => useLevel(level, parents, undefined, true);

export const useLevelDeepSkipInput = <T extends HierarchyElementWithMeta>(
  level: T['meta']['level'],
  ...parents: UseLevelParents
): T[] => useLevel(level, parents, true, true);

export const useElementFilter = <T extends HierarchyElement, R extends T = T>(
  input: T[] | null,
  filter: (element: T) => boolean,
): R[] => {
  const memoizedInput = useArray(input);

  return useMemo(
    () => memoizedInput?.filter((element) => filter(element)) || [],
    [filter, memoizedInput],
  ) as R[];
};

export const useMetaFilter = <
  T extends HierarchyElementWithMeta,
  R extends T = T,
>(
  input: T[],
  filter: (meta: T['meta']) => boolean,
): R[] => {
  const innerFilter = useCallback(({ meta }: T) => filter(meta), [filter]);

  return useElementFilter(input, innerFilter);
};

export const useChild = <
  T extends HierarchyElement,
  K extends keyof NonNullable<T['children']>,
>(
  input: T | null,
  child: K,
): NonNullable<T['children']>[K] | null =>
  useMemo(() => {
    if (!input) return null;

    const { children } = input;
    if (!children) return null;

    const { [child]: childElement } = children;
    if (!childElement) return null;

    return childElement as NonNullable<T['children']>[K];
  }, [child, input]);

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
  child: string,
): T | null => {
  const { useGetterIndex } = useContext(WebApiContext);

  const element = useChild(
    input,
    child as keyof NonNullable<typeof input>['children'],
  ) as unknown as HierarchyElement;
  return useGetterIndex(element?.get);
};

// eslint-disable-next-line comma-spacing
export const useSetter = <T,>(
  element: HierarchyElement | null,
): SetterFunction<T> | null => {
  const { useSetterIndex } = useContext(WebApiContext);

  return useSetterIndex(element?.set);
};

// eslint-disable-next-line comma-spacing
export const useChildSetter = <T,>(
  input: HierarchyElement | null,
  child: string,
): SetterFunction<T> | null => {
  const { useSetterIndex } = useContext(WebApiContext);

  const element = useChild(
    input,
    child as keyof NonNullable<typeof input>['children'],
  ) as unknown as HierarchyElement;
  return useSetterIndex(element?.set);
};

export const useStreamCount = (): number | null => {
  const { useGetterIndex } = useContext(WebApiContext);

  return useGetterIndex(-1);
};
