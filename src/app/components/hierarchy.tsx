import { WebApiNode, useWebApiNode } from '../web-api/hooks.js';
import { useMemo, useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import { HierarchyElement } from '../web-api/main.js';
import { styled } from 'goober';

const Container = styled('table')`
  border-collapse: collapse;
  border: 1px solid currentColor;
  color: hsl(var(--black));
  margin: 1rem;
  vertical-align: top;

  table,
  td {
    border-collapse: collapse;
    border: 1px solid currentColor;
    vertical-align: top;
  }

  table {
    margin: 0.2rem;
  }

  tr:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  td {
    padding: 0.5rem;
  }

  thead {
    font-weight: bold;
  }
`;

const GetterValue = styled('span')`
  word-break: break-all;
`;

const Meta: FunctionComponent<{ node: WebApiNode }> = ({ node }) => {
  const { meta } = node;

  if (!Object.keys(meta).length) return null;

  return (
    <tr>
      <td>
        <b>Meta</b>
      </td>
      <td>
        <table>
          <thead>
            <tr>
              <td>key</td>
              <td>value</td>
            </tr>
          </thead>
          <tbody>
            {Object.entries(meta).map(([key, value]) => (
              <tr>
                <td>{key}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </td>
    </tr>
  );
};

const Getter: FunctionComponent<{ node: WebApiNode }> = ({ node }) => {
  const { getterIndex, useGetter } = node;

  const value = useMemo(
    () => JSON.stringify(useGetter<unknown>()),
    [useGetter]
  );

  if (getterIndex === null) return null;

  return (
    <tr>
      <td>
        <b>Getter</b> <i>{getterIndex}</i>
      </td>
      <td>
        <GetterValue>{value}</GetterValue>
      </td>
    </tr>
  );
};

const Setter: FunctionComponent<{ node: WebApiNode }> = ({ node }) => {
  const { meta, setterIndex, useSetter } = node;

  const setter = useSetter<unknown>();

  const isNull = meta.type === 'null';

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

        if (valueType !== meta.type) {
          currentTarget.setCustomValidity(
            `parsed type does not match the required type! Needed: ${meta.type}, parsed: ${valueType}`
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

  if (setterIndex === null) return null;

  return (
    <tr>
      <td>
        <b>Setter</b> <i>{setterIndex}</i>
      </td>
      <td>
        {isNull ? (
          <button onClick={() => setter(null)}>null</button>
        ) : (
          <form action="#" onSubmit={onSubmit}>
            <input placeholder={meta.type} onChange={onChange} />
          </form>
        )}
      </td>
    </tr>
  );
};

const Child: FunctionComponent<{ name: string; node: HierarchyElement }> = ({
  name,
  node,
}) => {
  if (!node || typeof node !== 'object') return null;
  if (Object.keys(node).length <= 1) return null;

  return (
    <tr>
      <td>
        <b>Child:</b> {name}
      </td>
      <td>
        {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
        <Hierarchy element={node} />
      </td>
    </tr>
  );
};

export const Hierarchy: FunctionComponent<{ element: HierarchyElement }> = ({
  element,
}) => {
  const node = useWebApiNode(element);
  const { children } = node;

  return (
    <Container>
      <Meta node={node} />
      <Getter node={node} />
      <Setter node={node} />
      {Object.entries(children).map(([key, value]) => (
        <Child name={key} node={value} />
      ))}
    </Container>
  );
};
