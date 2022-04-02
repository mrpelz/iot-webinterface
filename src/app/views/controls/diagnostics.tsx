import {
  HierarchyElement,
  Levels,
  ParentRelation,
  ValueType,
  isElementWithMeta,
  isMetaPropertyActuator,
  isMetaPropertySensorDate,
  levelToString,
  parentRelationToString,
  typeToValueType,
  valueTypeToType,
} from '../../web-api.js';
import { useGetter, useSetter } from '../../state/web-api.js';
import { useMemo, useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import { Summary } from '../../components/controls/diagnostics.js';
import { useI18n } from '../../state/i18n.js';

export const Meta: FunctionComponent<{ element: HierarchyElement }> = ({
  element,
}) => {
  if (!isElementWithMeta(element)) return null;

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
  const isDate = isMetaPropertySensorDate(meta);

  const { country } = useI18n();

  const rawState = useGetter<unknown>(element);
  const state = useMemo(() => {
    return isDate && country && rawState
      ? new Date(rawState as number).toLocaleString(country)
      : JSON.stringify(rawState, undefined, 2);
  }, [isDate, country, rawState]);

  if (get === undefined) return null;

  return (
    <tr>
      <td>
        <b>Getter</b> <i>{get}</i>
      </td>
      <td>
        <pre>{state}</pre>
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

  const onChange: JSX.EventHandler<
    JSX.TargetedEvent<HTMLInputElement, Event>
  > = ({ currentTarget }) => {
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

const Child: FunctionComponent<{
  element: HierarchyElement;
  name: string;
  open: boolean;
}> = ({ name, element, open }) => {
  const { get, children, set } = element;
  if (get === undefined && !children && set === undefined) return null;

  return (
    <tr>
      <td colSpan={999}>
        <details open={open}>
          <Summary>
            <b>Child:</b> {name}
          </Summary>

          {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
          <Hierarchy element={element} />
        </details>
      </td>
    </tr>
  );
};

export const Hierarchy: FunctionComponent<{ element: HierarchyElement }> = ({
  element,
}) => {
  const { children: hierarchyChildren } = element;

  const openChildList =
    element.meta?.level === Levels.SYSTEM ||
    element.meta?.level === Levels.HOME ||
    element.meta?.level === Levels.BUILDING;

  return (
    <table>
      <Meta element={element} />
      <Getter element={element} />
      <Setter element={element} />
      {hierarchyChildren
        ? Object.entries(hierarchyChildren).map(([name, child]) => (
            <Child name={name} element={child} open={openChildList} />
          ))
        : null}
    </table>
  );
};
