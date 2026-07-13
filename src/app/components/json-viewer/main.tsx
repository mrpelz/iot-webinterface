/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */

import { isObject } from '@mrpelz/misc-utils/oop';
import { ComponentChild, createContext, FunctionComponent, JSX } from 'preact';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';

import { useArray } from '../../hooks/use-array-compare.js';
import { Details, Inset, useIsOpen } from '../details.js';
import {
  arrayRenderer,
  objectRenderer,
  primitiveRenderer,
} from './basic-renderers.js';
import {
  Annotation,
  Background,
  INSET_CH,
  Key as KeyComponent,
  Property,
  Treeline,
  TypeAnnotation,
  TypeString,
  Wrapper,
} from './components.js';

export type Renderer<T> = {
  RenderValue: FunctionComponent<{ path: PropertyKey[]; value: T }>;
  is: (path: PropertyKey[], input: any) => input is T;
};

export type JSONViewerInnerProps = {
  path?: PropertyKey[];
  value: any;
};

export type JSONViewerProps = {
  autoExpandLevel?: number;
  autoExpandPath?: PropertyKey[];
  handlePathChange?: (paths: PropertyKey[][]) => void;
  renderers?: Set<Renderer<any>>;
  rootLabel?: ComponentChild;
  value: any;
};

type TJSONViewerContext = {
  autoExpandLevel: number;
  autoExpandPath: PropertyKey[];
  circularCache: WeakSet<object>;
  handlePathChange: (path: PropertyKey[], isOpen: boolean) => void;
  renderers: Set<Renderer<any>>;
  rootLabel: ComponentChild;
};

export const JSONViewerContext = createContext(
  undefined as unknown as TJSONViewerContext,
);

export const Key: FunctionComponent<{
  path: PropertyKey[];
}> = ({ path }) => {
  const { rootLabel } = useContext(JSONViewerContext);
  const isOpen = useIsOpen();

  const key = path.at(-1);
  const path_ = useMemo(() => path.join('.'), [path]);

  const onCopy = useCallback<JSX.ClipboardEventHandler<HTMLSpanElement>>(
    (event) => {
      event.clipboardData?.setData('text/plain', path_);
      event.preventDefault();
    },
    [path_],
  );

  if (key === undefined) return <KeyComponent>{rootLabel}</KeyComponent>;

  const keyNode = (
    <KeyComponent
      isIndex={typeof key === 'number'}
      title={path_}
      onCopy={onCopy}
    >
      {key.toString()}:
    </KeyComponent>
  );

  return (
    <>
      <Treeline
        content={isOpen ? undefined : '›'}
        indent={path.length - 1}
      />
      {key === 'main' ? <Background type="key">{keyNode}</Background> : keyNode}
    </>
  );
};

export const JSONViewerInner: FunctionComponent<JSONViewerInnerProps> = ({
  path = [],
  value,
}) => {
  const { circularCache, renderers } = useContext(JSONViewerContext);

  useEffect(() => {
    if (!isObject(value) || circularCache.has(value)) {
      return () => {
        /* noop */
      };
    }

    circularCache.add(value);

    return () => {
      circularCache.delete(value);
    };
  }, [circularCache, value]);

  if (isObject(value) && circularCache.has(value)) return null;

  for (const renderer of renderers) {
    if (!renderer.is(path, value)) continue;

    return (
      <Property>
        <renderer.RenderValue
          path={path}
          value={value}
        />
      </Property>
    );
  }

  return null;
};

export const JSONViewerIndependentSubtree: FunctionComponent<
  JSONViewerInnerProps
> = (props) => {
  const context = useContext(JSONViewerContext);

  return (
    <JSONViewerContext.Provider
      value={{
        ...context,
        circularCache: new WeakSet(),
      }}
    >
      <JSONViewerInner {...props} />
    </JSONViewerContext.Provider>
  );
};

export const makeRenderer = <T,>(
  is: Renderer<T>['is'],
  useTransformValue: (
    path: PropertyKey[],
    value: T,
    type: TypeString,
  ) => ComponentChild,
  type?: TypeString,
  label?: string,
  background?: boolean,
): Renderer<T> => ({
  RenderValue: ({ path, value }) => {
    const path_ = useArray(path);

    const type_ = useMemo(() => {
      if (type) return type;

      if (value === null) return 'null';
      return typeof value as TypeString;
    }, [value]);

    const inner = (
      <>
        <Key path={path_} /> <TypeAnnotation content={label ?? type_} />
        {useTransformValue(path_, value, type_) ?? null},
      </>
    );

    return background ? <Background type={type_}>{inner}</Background> : inner;
  },
  is,
});

export const useExpandingRendererUtils = <T,>(props: {
  path: PropertyKey[];
  value: T;
}): {
  handleToggle: (isOpen: boolean) => void;
  initiallyOpen: boolean;
  isParentOpen: boolean;
  path: PropertyKey[];
  value: T | undefined;
} => {
  const { autoExpandLevel, autoExpandPath, handlePathChange } =
    useContext(JSONViewerContext);

  const autoExpandPath_ = useArray(autoExpandPath);
  const path = useArray(props.path);

  const initiallyOpen =
    useMemo(
      () =>
        autoExpandPath_.length > 0
          ? path.every((key, index) => key === autoExpandPath_.at(index))
          : false,
      [autoExpandPath_, path],
    ) || path.length < autoExpandLevel;
  const isParentOpen = (useIsOpen() ?? initiallyOpen) || path.length === 0;

  const value = isParentOpen ? props.value : undefined;

  const handleToggle = useCallback(
    (isOpen: boolean) => handlePathChange(path, isOpen),
    [handlePathChange, path],
  );

  return useMemo(
    () => ({
      handleToggle,
      initiallyOpen,
      isParentOpen,
      path,
      value,
    }),
    [handleToggle, initiallyOpen, isParentOpen, path, value],
  );
};

export const makeExpandingRenderer = <T,>(
  is: Renderer<T>['is'],
  label: string,
  useGetChildren: (path: PropertyKey[], value: any) => ComponentChild[],
  prefix: string,
  suffix: string,
): Renderer<T> => ({
  RenderValue: (props) => {
    const { handleToggle, initiallyOpen, path, value } =
      useExpandingRendererUtils(props);

    const key = useMemo(
      () => (
        <>
          <Key path={path} /> <TypeAnnotation content={label} />
        </>
      ),
      [path],
    );

    const children = useGetChildren(path, value);

    const annotation = useMemo(
      () => (
        <Annotation
          content={`${children.length} item${children.length === 1 ? '' : 's'}`}
        />
      ),
      [children.length],
    );

    return (
      <Details
        handleToggle={handleToggle}
        open={initiallyOpen}
        showCollapseExpandAllIcon={path.length > 0}
        showExpandIcon={false}
        summary={
          <>
            {key}
            {prefix}
            {annotation}
            {suffix},
          </>
        }
        summaryExpanded={
          <>
            {key}
            {prefix}
            {annotation}
          </>
        }
      >
        <Inset inset={INSET_CH}>{children}</Inset>
        {suffix},
      </Details>
    );
  },
  is,
});

export const JSONViewer: FunctionComponent<JSONViewerProps> = ({
  autoExpandLevel = 0,
  autoExpandPath = [],
  handlePathChange,
  renderers = new Set([arrayRenderer, objectRenderer, primitiveRenderer]),
  rootLabel = null,
  value,
}) => {
  const [openPathsKeys_, setOpenPathsArray] = useState([] as string[]);
  const openPathsKeys = useArray(openPathsKeys_);

  const openPathsRef = useRef(new Map<string, PropertyKey[]>());
  const openPaths = useMemo(() => {
    const { current: openPaths_ } = openPathsRef;

    return (
      openPathsKeys
        .map((key) => openPaths_.get(key))
        // eslint-disable-next-line no-implicit-coercion
        .filter((path) => !!path)
    );
  }, [openPathsKeys]);

  const handlePathChange_ = useCallback(
    (path: PropertyKey[], isOpen: boolean) => {
      const { current: openPaths_ } = openPathsRef;

      const pathKey = ['$', path].flat().join('.');

      if (isOpen) {
        openPaths_.set(pathKey, path);
      } else {
        for (const [key] of openPaths_) {
          if (!key.startsWith(pathKey)) continue;

          openPaths_.delete(key);
        }
      }

      setOpenPathsArray(
        Array.from(openPaths_.entries())
          .toSorted((a, b) => a[1].length - b[1].length)
          .map(([key]) => key),
      );
    },
    [],
  );

  useEffect(() => handlePathChange?.(openPaths), [handlePathChange, openPaths]);

  return (
    <JSONViewerContext.Provider
      value={{
        autoExpandLevel,
        autoExpandPath,
        circularCache: new WeakSet(),
        handlePathChange: handlePathChange_,
        renderers,
        rootLabel,
      }}
    >
      <Wrapper>
        <JSONViewerInner
          path={[]}
          value={value}
        />
      </Wrapper>
    </JSONViewerContext.Provider>
  );
};
