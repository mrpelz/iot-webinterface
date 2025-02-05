/* eslint-disable @typescript-eslint/naming-convention */

import { isObject } from '@iot/iot-monolith/oop';
import { ComponentChild, createContext, FunctionComponent, JSX } from 'preact';
import { useCallback, useContext, useEffect, useMemo } from 'preact/hooks';

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
  is: (path: PropertyKey[], input: unknown) => input is T;
};

export type JSONViewerInnerProps = {
  path?: PropertyKey[];
  value: unknown;
};

export type JSONViewerProps = JSONViewerInnerProps & {
  autoExpandLevel?: number;
  renderers?: Set<Renderer<unknown>>;
  rootLabel?: ComponentChild;
};

type TJSONViewerContext = {
  autoExpandLevel: number;
  circularCache: WeakSet<object>;
  renderers: Set<Renderer<unknown>>;
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
      onCopy={onCopy}
      title={path_}
    >
      {key.toString()}:
    </KeyComponent>
  );

  return (
    <>
      <Treeline content={isOpen ? undefined : '›'} indent={path.length - 1} />
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
        <renderer.RenderValue path={path} value={value} />
      </Property>
    );
  }

  return null;
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

export const makeExpandingRenderer = <T,>(
  is: Renderer<T>['is'],
  label: string,
  useGetChildren: (path: PropertyKey[], value: unknown) => ComponentChild[],
  prefix: string,
  suffix: string,
): Renderer<T> => ({
  RenderValue: ({ path, value }) => {
    const { autoExpandLevel } = useContext(JSONViewerContext);

    const path_ = useArray(path);

    const isOpen = path_.length <= autoExpandLevel;
    const isParentOpen = useIsOpen() ?? isOpen;

    const value_ = isParentOpen ? value : undefined;

    const key = useMemo(
      () => (
        <>
          <Key path={path_} /> <TypeAnnotation content={label} />
        </>
      ),
      [path_],
    );

    const children = useGetChildren(path_, value_);

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
        open={isOpen}
        collapsible={!isOpen}
        showCollapseExpandAllIcon={path_.length > 0}
        showExpandIcon={false}
        summary={
          <>
            {key}
            {prefix}
            {annotation}
            {suffix}
            {','}
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
        {suffix}
        {','}
      </Details>
    );
  },
  is,
});

export const JSONViewer: FunctionComponent<JSONViewerProps> = ({
  autoExpandLevel = 0,
  path,
  renderers = new Set([arrayRenderer, objectRenderer, primitiveRenderer]),
  rootLabel = null,
  value,
}) => (
  <JSONViewerContext.Provider
    value={{
      autoExpandLevel,
      circularCache: new WeakSet(),
      renderers,
      rootLabel,
    }}
  >
    <Wrapper>
      <JSONViewerInner path={path} value={value} />
    </Wrapper>
  </JSONViewerContext.Provider>
);
