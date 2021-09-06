import { HierarchyElement, ValueType } from '../web-api.js';
import { useGetter, useSetter } from '../hooks/web-api.js';
import { useMemo, useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import { styled } from 'goober';

const GetterValue = styled('span')`
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
            return (
              <tr>
                <td>{key}</td>
                <td>{JSON.stringify(value)}</td>
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
  const { get } = element;

  const rawState = useGetter<unknown>(element);
  const state = useMemo(() => JSON.stringify(rawState), [rawState]);

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
  const {
    meta: { valueType: _valueType },
    set,
  } = element;

  const valueType = _valueType as ValueType;

  const setter = useSetter<unknown>(element);

  const isNull = valueType === 0;

  const [input, setInput] = useState<unknown>(undefined);

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
        const inputType = (() => {
          if (parsedValue === null) return ValueType.NULL;

          switch (typeof parsedValue) {
            case 'boolean':
              return ValueType.BOOLEAN;
            case 'number':
              return ValueType.NUMBER;
            case 'string':
              return ValueType.STRING;
            default:
              return ValueType.RAW;
          }
        })();

        if (inputType !== valueType) {
          currentTarget.setCustomValidity(
            `parsed type does not match the required type! Needed: ${valueType}, parsed: ${inputType}`
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
            <input onChange={onChange} />
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
      <td>
        <b>Child:</b> {name}
      </td>
      <td>
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
        ? Object.entries(hierarchyChildren).map(([name, child]) => (
            <Child name={name} element={child} />
          ))
        : null}
    </table>
  );
};
