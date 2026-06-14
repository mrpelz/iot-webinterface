/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Level, Match, TExclude, ValueType } from '@iot/iot-monolith/tree';
import {
  InteractionReference,
  InteractionType,
  isInteractionReference,
  levelDescription,
  valueTypeDescription,
} from '@iot/iot-monolith/tree-serialization';
import { ensureKeys, isPlainObject } from '@mrpelz/misc-utils/oop';
import { computed } from '@preact/signals';
import { useMemo, useState } from 'preact/hooks';

import { TSystem } from '../../../common/types.js';
import { serialized } from '../../api.js';
import {
  useTypedCollector,
  useTypedCollectorEmitter,
  useTypedEmitter,
} from '../../hooks/use-api.js';
import { useTruthy } from '../../hooks/use-first-truthy.js';
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
  Key,
  makeExpandingRenderer,
  makeRenderer,
  Renderer,
  useExpandingRendererUtils,
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
  Match<{ $: 'getter' }, TExclude, TSystem>
> = {
  RenderValue: (props) => {
    const { value } = props;

    const { handleToggle, initiallyOpen, path } =
      useExpandingRendererUtils(props);
    const isParentOpen = useTruthy(useIsOpen() ?? initiallyOpen);

    // @ts-ignore
    const { unit, valueType } = value;
    const isDate = unit === 'date';

    const emitter = useTypedEmitter(
      serialized(isParentOpen ? value : undefined),
    );
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
          <Key path={path} />{' '}
          <TypeAnnotation content={`getter (${isDate ? 'date' : type})`} />
          <br />
          <PrimitiveValue type={type}>{liveValue}</PrimitiveValue>
          <br />
          <TypeAnnotation content="object" />
        </>
      ),
      [isDate, liveValue, path, type],
    );

    // @ts-ignore
    const children = useGetObjectChildren(
      path,
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
        open={initiallyOpen}
        handleToggle={handleToggle}
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
  is: (_path, input): input is Match<{ $: 'getter' }, TExclude, TSystem> => {
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
  Match<{ $: 'setter' }, TExclude, TSystem>
> = {
  // @ts-ignore
  RenderValue: (props) => {
    const { value } = props;

    const { handleToggle, initiallyOpen, path } =
      useExpandingRendererUtils(props);
    const isParentOpen = useTruthy(useIsOpen() ?? initiallyOpen);

    // @ts-ignore
    const { valueType } = value;
    const type = useMemo(() => valueTypeDescription[valueType], [valueType]);

    const emitter = useTypedEmitter(
      serialized(isParentOpen ? value : undefined),
    );
    const liveValue = computed(() => JSON.stringify(emitter.value));

    const setEmitter = useTypedCollectorEmitter(
      serialized(isParentOpen ? value : undefined),
    );
    const setLiveValue = computed(() => JSON.stringify(setEmitter.value));

    // @ts-ignore
    const collector = useTypedCollector(serialized(value));

    const [inputValue, setInputValue] = useState('');

    const input = useMemo(() => {
      if (valueType === ValueType.BOOLEAN) {
        return (
          <>
            <button
              type="button"
              style={{ cursor: 'pointer' }}
              onClick={(event) => {
                event.preventDefault();
                collector(true);
              }}
            >
              true
            </button>
            <button
              type="button"
              style={{ cursor: 'pointer', marginInlineStart: '1ch' }}
              onClick={(event) => {
                event.preventDefault();
                collector(false);
              }}
            >
              false
            </button>
          </>
        );
      }

      if (valueType === ValueType.NUMBER) {
        return (
          <>
            <input
              inputMode="decimal"
              onInput={(event) => setInputValue(event.currentTarget.value)}
              placeholder={computed(() => emitter.value?.toString())}
              type="text"
              value={inputValue}
              onKeyDown={(event) => {
                if (!['Enter', 'NumpadEnter'].includes(event.code)) return;

                event.preventDefault();
                if (inputValue.length === 0) return;

                collector(Number.parseFloat(inputValue) ?? 0);
                setInputValue('');
              }}
            />
            <button
              type="button"
              style={{ cursor: 'pointer', marginInlineStart: '1ch' }}
              onClick={(event) => {
                event.preventDefault();
                if (inputValue.length === 0) return;

                collector(Number.parseFloat(inputValue) ?? 0);
                setInputValue('');
              }}
            >
              set
            </button>
          </>
        );
      }

      return null;
    }, [collector, emitter.value, inputValue, valueType]);

    const key = useMemo(
      () => (
        <>
          <Key path={path} /> <TypeAnnotation content={`setter (${type})`} />
          <br />
          <Annotation content="set:" />
          <PrimitiveValue type={type}>{setLiveValue}</PrimitiveValue> {input}
          <br />
          <Annotation content="actual:" />
          <PrimitiveValue type={type}>{liveValue}</PrimitiveValue>
          <br />
          <TypeAnnotation content="object" />
        </>
      ),
      [input, liveValue, path, setLiveValue, type],
    );

    // @ts-ignore
    const children = useGetObjectChildren(
      path,
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
        handleToggle={handleToggle}
        open={initiallyOpen}
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
  is: (_path, input): input is Match<{ $: 'setter' }, TExclude, TSystem> => {
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
  Match<{ $: 'trigger' }, TExclude, TSystem>
> = {
  RenderValue: (props) => {
    const { value } = props;

    const { handleToggle, initiallyOpen, path } =
      useExpandingRendererUtils(props);
    const isParentOpen = useTruthy(useIsOpen() ?? initiallyOpen);

    // @ts-ignore
    const collector = useTypedCollector(serialized(value));

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
          <Key path={path} /> <TypeAnnotation content="trigger" />
          {input}
          <br />
          <TypeAnnotation content="object" />
        </>
      ),
      [input, path],
    );

    // @ts-ignore
    const children = useGetObjectChildren(
      path,
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
        handleToggle={handleToggle}
        open={initiallyOpen}
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
  is: (_path, input): input is Match<{ $: 'trigger' }, TExclude, TSystem> => {
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
