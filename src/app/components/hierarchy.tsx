import {
  HierarchyElement,
  Levels,
  ParentRelation,
  ValueType,
  isMetaPropertyActuator,
  isMetaPropertySensor,
  levelToString,
  parentRelationToString,
  typeToValueType,
  valueTypeToType,
} from '../web-api.js';
import { useGetter, useSetter } from '../hooks/web-api.js';
import { useMemo, useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import { styled } from 'goober';
import { useI18n } from '../hooks/i18n.js';

const GetterValue = styled('pre')`
  word-break: break-all;
`;

const Meta: FunctionComponent<{ element: HierarchyElement }> = ({
  element,
}) => {
  const { meta } = element;

  if (!Object.keys(meta).length) return null;

  return (
    <tr>
      <td>
        <b>Meta</b>
      </td>
      <td>
        <table>
          {Object.entries(meta).map(([key, value]) => {
            const level =
              key === 'level'
                ? levelToString(value as unknown as Levels)
                : null;

            const parentRelation =
              key === 'parentRelation'
                ? parentRelationToString(value as unknown as ParentRelation)
                : null;

            const valueType =
              key === 'valueType'
                ? valueTypeToType(value as unknown as ValueType)
                : null;

            return (
              <tr>
                <td>{key}</td>
                <td>
                  {level ||
                    parentRelation ||
                    valueType ||
                    JSON.stringify(value)}
                </td>
              </tr>
            );
          })}
        </table>
      </td>
    </tr>
  );
};

const Getter: FunctionComponent<{ element: HierarchyElement }> = ({
  element,
}) => {
  const { get, meta } = element;
  const isLastSeen = isMetaPropertySensor(meta) && meta.name === 'lastSeen';

  const { country } = useI18n();

  const rawState = useGetter<unknown>(element);
  const state = useMemo(() => {
    return isLastSeen && country && rawState
      ? new Date(rawState as number).toLocaleString(country)
      : JSON.stringify(rawState, undefined, 2);
  }, [isLastSeen, country, rawState]);

  if (get === undefined) return null;

  return (
    <tr>
      <td>
        <b>Getter</b> <i>{get}</i>
      </td>
      <td>
        <GetterValue>{state}</GetterValue>
      </td>
    </tr>
  );
};

const Setter: FunctionComponent<{ element: HierarchyElement }> = ({
  element,
}) => {
  const { meta, set } = element;

  const setter = useSetter<unknown>(element);
  const [input, setInput] = useState<unknown>(undefined);

  if (set === undefined || !isMetaPropertyActuator(meta)) return null;

  const { valueType } = meta;
  const isNull = valueType === ValueType.NULL;
  const namedValueType = valueTypeToType(valueType);

  const onChange: JSX.EventHandler<JSX.TargetedEvent<HTMLInputElement, Event>> =
    ({ currentTarget }) => {
      const { value } = currentTarget;

      if (!value.length) {
        currentTarget.setCustomValidity('');
        setInput(undefined);

        return;
      }

      try {
        const parsedValue = JSON.parse(value);
        const inputType = typeToValueType(parsedValue);
        const namedInputType = valueTypeToType(inputType);

        if (inputType !== valueType) {
          currentTarget.setCustomValidity(
            `parsed type does not match the required type! Needed: ${namedValueType}, parsed: ${namedInputType}`
          );

          return;
        }

        currentTarget.setCustomValidity('');
        setInput(parsedValue);
      } catch {
        currentTarget.setCustomValidity('invalid input');
      }
    };

  const onSubmit: JSX.GenericEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (input === undefined) return;

    setter(input);
  };

  if (set === undefined) return null;

  return (
    <tr>
      <td>
        <b>Setter</b> <i>{set}</i>
      </td>
      <td>
        {isNull ? (
          <button onClick={() => setter(null)}>null</button>
        ) : (
          <form action="#" onSubmit={onSubmit}>
            <input placeholder={namedValueType} onChange={onChange} />
          </form>
        )}
      </td>
    </tr>
  );
};

const Child: FunctionComponent<{ element: HierarchyElement; name: string }> = ({
  name,
  element,
}) => {
  if (!element) return null;

  const { get, children, set } = element;
  if (get === undefined && !children && set === undefined) return null;

  return (
    <tr>
      <td colSpan={999}>
        <b>Child:</b> {name}
        {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
        <Hierarchy element={element} />
      </td>
    </tr>
  );
};

export const Hierarchy: FunctionComponent<{ element: HierarchyElement }> = ({
  element,
}) => {
  if (!element) return null;

  const { children: hierarchyChildren } = element;

  return (
    <table>
      <Meta element={element} />
      <Getter element={element} />
      <Setter element={element} />
      {hierarchyChildren
        ? Object.entries(hierarchyChildren).map(([name, child]) => {
            return 'meta' in child ? (
              <Child name={name} element={child} />
            ) : null;
          })
        : null}
    </table>
  );
};
