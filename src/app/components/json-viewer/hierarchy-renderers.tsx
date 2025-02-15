/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ensureKeys, isPlainObject } from '@iot/iot-monolith/oop';
import { Level, Match, TExclude, ValueType } from '@iot/iot-monolith/tree';
import {
  InteractionReference,
  InteractionType,
  isInteractionReference,
  levelDescription,
  valueTypeDescription,
} from '@iot/iot-monolith/tree-serialization';
import { computed } from '@preact/signals';
import { useContext, useMemo } from 'preact/hooks';

import { TSerialization } from '../../../common/types.js';
import { useArray } from '../../hooks/use-array-compare.js';
import { useFirstTruthy } from '../../hooks/use-first-truthy.js';
import { useTypedCollector, useTypedEmitter } from '../../state/api.js';
import { Details, Inset, useIsOpen } from '../details.js';
import {
  useGetObjectChildren,
  useTransformPrimitiveValue,
} from './basic-renderers.js';
import {
  Annotation,
  INSET_CH,
  PrimitiveValue,
  TypeAnnotation,
  TypeString,
} from './components.js';
import {
  JSONViewerContext,
  Key,
  makeExpandingRenderer,
  makeRenderer,
  Renderer,
} from './main.js';

export const idRenderer = makeRenderer<string>(
  (path, input): input is string =>
    (path.at(-1) === '$id' ||
      (['state', 'setState'].includes(path.at(-2) as string) &&
        path.at(-1) === 'reference')) &&
    typeof input === 'string',
  useTransformPrimitiveValue,
  'string',
  'uuid',
  true,
);

export const speciesRenderer = makeRenderer<string>(
  (path, input): input is string =>
    path.at(-1) === '$' && typeof input === 'string',
  useTransformPrimitiveValue,
  'string',
  'species',
);

const useTransformLevel = (
  _path: PropertyKey[],
  input: number,
  type: TypeString,
) => (
  <PrimitiveValue type={type}>
    {useMemo(() => levelDescription[input as Level], [input])}
  </PrimitiveValue>
);

export const levelRenderer = makeRenderer<number>(
  (path, input): input is number =>
    path.at(-1) === 'level' && typeof input === 'number',
  useTransformLevel,
  'index',
  'enum',
  false,
);

const useTransformValueType = (
  _path: PropertyKey[],
  input: number,
  type: TypeString,
) => (
  <PrimitiveValue type={type}>
    {useMemo(() => valueTypeDescription[input as ValueType], [input])}
  </PrimitiveValue>
);

export const valueTypeRenderer = makeRenderer<number>(
  (path, input): input is number =>
    path.at(-1) === 'valueType' && typeof input === 'number',
  useTransformValueType,
  'index',
  'enum',
  false,
);

const useTransformInteractionType = (
  _path: PropertyKey[],
  input: number,
  type: TypeString,
) => (
  <PrimitiveValue type={type}>
    {useMemo(
      () =>
        (input as InteractionType) === InteractionType.EMIT
          ? 'EMIT'
          : 'COLLECT',
      [input],
    )}
  </PrimitiveValue>
);

export const interactionTypeRenderer = makeRenderer<number>(
  (path, input): input is number =>
    ['state', 'setState'].includes(path.at(-2) as string) &&
    path.at(-1) === 'type' &&
    typeof input === 'number',
  useTransformInteractionType,
  'index',
  'enum',
  false,
);

export const collectInteractionReferenceRenderer = makeExpandingRenderer<
  InteractionReference<string, InteractionType.COLLECT>
>(
  (_path, input) => isInteractionReference(input, InteractionType.COLLECT),
  'interaction reference (collect)',
  useGetObjectChildren,
  '{',
  '}',
);

export const emitInteractionReferenceRenderer = makeExpandingRenderer<
  InteractionReference<string, InteractionType.EMIT>
>(
  (_path, input) => isInteractionReference(input, InteractionType.EMIT),
  'interaction reference (emit)',
  useGetObjectChildren,
  '{',
  '}',
);

export const getterRenderer: Renderer<
  // @ts-ignore
  Match<{ $: 'getter' }, TExclude, TSerialization>
> = {
  RenderValue: ({ path, value }) => {
    // @ts-ignore
    const path_ = useArray(path);

    const { autoExpandLevel } = useContext(JSONViewerContext);
    // @ts-ignore
    const isOpen = path_.length < autoExpandLevel;
    const isParentOpen = useFirstTruthy(useIsOpen() ?? isOpen);

    // @ts-ignore
    const { unit, valueType } = value;
    const isDate = unit === 'date';

    const emitter = useTypedEmitter(isParentOpen ? value : undefined);
    const liveValue = computed(() => {
      if (isDate && typeof emitter.value === 'number') {
        return new Date(emitter.value).toUTCString();
      }

      return JSON.stringify(emitter.value);
    });

    const type = useMemo(() => valueTypeDescription[valueType], [valueType]);

    const key = useMemo(
      () => (
        <>
          <Key path={path_} />{' '}
          <TypeAnnotation content={`getter (${isDate ? 'date' : type})`} />
          <PrimitiveValue type={type}>{liveValue}</PrimitiveValue>
          <br />
          <TypeAnnotation content="object" />
        </>
      ),
      [isDate, liveValue, path_, type],
    );

    // @ts-ignore
    const children = useGetObjectChildren(
      path_,
      isParentOpen ? value : undefined,
    );

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
        showExpandIcon={false}
        summary={
          <>
            {key}
            {'{'}
            {annotation}
            {'},'}
          </>
        }
        summaryExpanded={
          <>
            {key}
            {'{'}
            {annotation}
          </>
        }
      >
        <Inset inset={INSET_CH}>{children}</Inset>
        {'},'}
      </Details>
    );
  },
  // @ts-ignore
  is: (
    _path,
    input,
  ): input is Match<{ $: 'getter' }, TExclude, TSerialization> => {
    if (!isPlainObject(input)) return false;
    const { $, state, level, valueType } = ensureKeys(
      // @ts-ignore
      input as Record<PropertyKey, unknown>,
      '$',
      'state',
      'level',
      'valueType',
    );

    if (
      $ !== 'getter' ||
      !state ||
      level !== Level.ELEMENT ||
      valueType === undefined
    ) {
      return false;
    }

    return isInteractionReference(state, InteractionType.EMIT);
  },
};

// @ts-ignore
export const setterRenderer: Renderer<
  Match<{ $: 'setter' }, TExclude, TSerialization>
> = {
  // @ts-ignore
  RenderValue: ({ path, value }) => {
    // @ts-ignore
    const path_ = useArray(path);

    const { autoExpandLevel } = useContext(JSONViewerContext);
    // @ts-ignore
    const isOpen = path_.length < autoExpandLevel;
    const isParentOpen = useFirstTruthy(useIsOpen() ?? isOpen);

    // @ts-ignore
    const { valueType } = value;
    const type = useMemo(() => valueTypeDescription[valueType], [valueType]);

    const emitter = useTypedEmitter(isParentOpen ? value : undefined);
    const liveValue = computed(() => JSON.stringify(emitter.value));

    // @ts-ignore
    const collector = useTypedCollector(value);

    const input = useMemo(() => {
      if (valueType === ValueType.BOOLEAN) {
        return (
          <input
            type="checkbox"
            indeterminate={computed(() => emitter.value === null)}
            checked={computed(
              () => (emitter.value as boolean | undefined) ?? false,
            )}
            onChange={(event) => {
              event.preventDefault();
              collector(event.currentTarget.checked);
            }}
          />
        );
      }

      if (valueType === ValueType.NUMBER) {
        return (
          <input
            type="text"
            inputMode="decimal"
            value={computed(() => emitter.value as number | undefined)}
            onKeyDown={(event) => {
              if (!['Enter', 'NumpadEnter'].includes(event.code)) return;

              event.preventDefault();
              if (event.currentTarget.value.length === 0) return;

              collector(Number.parseFloat(event.currentTarget.value) ?? 0);
            }}
          />
        );
      }

      return null;
    }, [collector, emitter.value, valueType]);

    const key = useMemo(
      () => (
        <>
          <Key path={path_} /> <TypeAnnotation content={`setter (${type})`} />
          <Annotation content="set:" />
          {input}
          <Annotation content="actual:" />
          <PrimitiveValue type={type}>{liveValue}</PrimitiveValue>
          <br />
          <TypeAnnotation content="object" />
        </>
      ),
      [input, liveValue, path_, type],
    );

    // @ts-ignore
    const children = useGetObjectChildren(
      path_,
      isParentOpen ? value : undefined,
    );

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
        showExpandIcon={false}
        summary={
          <>
            {key}
            {'{'}
            {annotation}
            {'},'}
          </>
        }
        summaryExpanded={
          <>
            {key}
            {'{'}
            {annotation}
          </>
        }
      >
        <Inset inset={INSET_CH}>{children}</Inset>
        {'},'}
      </Details>
    );
  },
  // @ts-ignore
  is: (
    _path,
    input,
  ): input is Match<{ $: 'setter' }, TExclude, TSerialization> => {
    if (!isPlainObject(input)) return false;
    const { $, setState, state, level, valueType } = ensureKeys(
      input as Record<PropertyKey, unknown>,
      '$',
      'level',
      'setState',
      'state',
      'valueType',
    );

    if (
      $ !== 'setter' ||
      !setState ||
      !state ||
      level !== Level.ELEMENT ||
      valueType === undefined
    ) {
      return false;
    }

    return (
      isInteractionReference(state, InteractionType.EMIT) &&
      isInteractionReference(setState, InteractionType.COLLECT)
    );
  },
};

export const triggerRenderer: Renderer<
  // @ts-ignore
  Match<{ $: 'trigger' }, TExclude, TSerialization>
> = {
  RenderValue: ({ path, value }) => {
    // @ts-ignore
    const path_ = useArray(path);

    const { autoExpandLevel } = useContext(JSONViewerContext);
    // @ts-ignore
    const isOpen = path_.length < autoExpandLevel;
    const isParentOpen = useFirstTruthy(useIsOpen() ?? isOpen);

    // @ts-ignore
    const collector = useTypedCollector(value);

    const input = useMemo(
      () => (
        <button
          style={{ cursor: 'pointer' }}
          type="button"
          onClick={(event) => {
            event.preventDefault();
            collector(null);
          }}
        >
          send
        </button>
      ),
      [collector],
    );

    const key = useMemo(
      () => (
        <>
          <Key path={path_} /> <TypeAnnotation content="trigger" />
          {input}
          <br />
          <TypeAnnotation content="object" />
        </>
      ),
      [input, path_],
    );

    // @ts-ignore
    const children = useGetObjectChildren(
      path_,
      isParentOpen ? value : undefined,
    );

    const annotation = useMemo(
      () => (
        <Annotation
          content={`${children.length} item${children.length > 1 ? 's' : ''}`}
        />
      ),
      [children.length],
    );

    return (
      <Details
        open={isOpen}
        collapsible={!isOpen}
        showExpandIcon={false}
        summary={
          <>
            {key}
            {'{'}
            {annotation}
            {'},'}
          </>
        }
        summaryExpanded={
          <>
            {key}
            {'{'}
            {annotation}
          </>
        }
      >
        <Inset inset={INSET_CH}>{children}</Inset>
        {'},'}
      </Details>
    );
  },
  // @ts-ignore
  is: (
    _path,
    input,
  ): input is Match<{ $: 'trigger' }, TExclude, TSerialization> => {
    if (!isPlainObject(input)) return false;
    const { $, setState, level, valueType } = ensureKeys(
      input as Record<PropertyKey, unknown>,
      '$',
      'level',
      'setState',
      'valueType',
    );

    if (
      $ !== 'trigger' ||
      !setState ||
      level !== Level.ELEMENT ||
      valueType === undefined
    ) {
      return false;
    }

    return isInteractionReference(setState, InteractionType.COLLECT);
  },
};
