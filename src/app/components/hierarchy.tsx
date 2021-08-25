import { useGetter, useSetter } from '../web-api/hooks.js';
import { useMemo, useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import { HierarchyElement } from '../web-api/main.js';
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
          {Object.entries(meta).map(([key, value]) => (
            <tr>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          ))}
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
    meta: { type },
    set,
  } = element;

  const setter = useSetter<unknown>(element);

  const isNull = type === 'null';

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
        const valueType = parsedValue === null ? 'null' : typeof parsedValue;

        if (valueType !== type) {
          currentTarget.setCustomValidity(
            `parsed type does not match the required type! Needed: ${type}, parsed: ${valueType}`
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
            <input placeholder={type} onChange={onChange} />
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
