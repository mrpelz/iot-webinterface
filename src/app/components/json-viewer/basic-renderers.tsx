import { isPlainObject, objectKeys } from '@iot/iot-monolith/oop';
import { ComponentChild } from 'preact';
import { useMemo } from 'preact/hooks';

import { useSafeJSONStringify } from '../../hooks/use-safe-json-stringify.js';
import { PrimitiveValue, TypeString } from './components.js';
import {
  JSONViewerInner,
  makeExpandingRenderer,
  makeRenderer,
} from './main.js';

export const useTransformPrimitiveValue = (
  _path: PropertyKey[],
  value: unknown,
  type: TypeString,
): ComponentChild => (
  <PrimitiveValue type={type}>
    {useSafeJSONStringify(value) ?? null}
  </PrimitiveValue>
);

export const primitiveRenderer = makeRenderer<
  boolean | null | number | string | undefined
>(
  (_path, input): input is boolean | null | number | string | undefined =>
    input === null ||
    ['boolean', 'number', 'string', 'undefined'].includes(typeof input),
  useTransformPrimitiveValue,
);

export const useGetObjectChildren = (
  path: PropertyKey[],
  value?: object,
): ComponentChild[] =>
  useMemo(
    () =>
      value
        ? objectKeys(value).map((childKey) => (
            <JSONViewerInner
              path={[path, childKey].flat()}
              value={value[childKey]}
            />
          ))
        : [],
    [path, value],
  );

export const objectRenderer = makeExpandingRenderer<object>(
  (_path, input) => isPlainObject(input),
  'object',
  useGetObjectChildren,
  '{',
  '}',
);

export const useGetArrayChildren = (
  path: PropertyKey[],
  value?: unknown[],
): ComponentChild[] =>
  useMemo(
    () =>
      value?.map((childValue, index) => (
        <JSONViewerInner path={[path, index].flat()} value={childValue} />
      )) ?? [],
    [path, value],
  );

export const arrayRenderer = makeExpandingRenderer<object>(
  (_path, input) => Array.isArray(input),
  'array',
  useGetArrayChildren,
  '[',
  ']',
);
