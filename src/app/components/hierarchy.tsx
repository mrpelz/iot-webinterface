import { useGetter, useSetter } from '../web-api/hooks.js';
import { useMemo, useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import { HierarchyNode } from '../web-api/main.js';
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

const Meta: FunctionComponent<{ node: HierarchyNode }> = ({ node }) => {
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

const Getter: FunctionComponent<{ node: HierarchyNode }> = ({ node }) => {
  const { get } = node;

  const rawState = useGetter<unknown>(node);
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

const Setter: FunctionComponent<{ node: HierarchyNode }> = ({ node }) => {
  const {
    meta: { type },
    set,
  } = node;

  const setter = useSetter<unknown>(node);

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

const Child: FunctionComponent<{ name: string; node: HierarchyNode }> = ({
  name,
  node,
}) => {
  if (!node) return null;

  const { get, nodes, set } = node;
  if (get === undefined && !nodes && set === undefined) return null;

  return (
    <tr>
      <td>
        <b>Child:</b> {name}
      </td>
      <td>
        {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
        <Hierarchy node={node} />
      </td>
    </tr>
  );
};

export const Hierarchy: FunctionComponent<{ node: HierarchyNode }> = ({
  node,
}) => {
  if (!node) return null;

  const { nodes } = node;

  return (
    <Container>
      <Meta node={node} />
      <Getter node={node} />
      <Setter node={node} />
      {nodes
        ? Object.entries(nodes).map(([name, childNode]) => (
            <Child name={name} node={childNode} />
          ))
        : null}
    </Container>
  );
};
