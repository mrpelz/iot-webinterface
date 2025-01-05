/* eslint-disable @typescript-eslint/ban-ts-comment */
import { isObject, isPlainObject } from '@iot/iot-monolith/oop';
import { Level, Match, ValueType } from '@iot/iot-monolith/tree';
import {
  levelDescription,
  valueTypeDescription,
} from '@iot/iot-monolith/tree-serialization';
import { computed } from '@preact/signals';
import { ComponentChildren, FunctionComponent, JSX } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';

import { TSerialization } from '../../common/types.js';
import { Summary } from '../components/diagnostics.js';
import { useCollector, useEmitter, useMatch } from '../state/api.js';

export const Details: FunctionComponent<{
  open?: boolean;
  summary: ComponentChildren;
}> = ({ children, open, summary }) => {
  const ref = useRef<HTMLDetailsElement>(null);
  const [isOpen, setIsOpen] = useState(Boolean(open));

  useEffect(() => {
    const { current: element } = ref;

    const fn = () => {
      if (!element) return;
      setIsOpen(element.open);
    };

    element?.addEventListener('toggle', fn);
    return () => element?.removeEventListener('toggle', fn);
  }, []);

  return (
    <details open={isOpen} ref={ref}>
      <Summary>{summary}</Summary>
      {isOpen ? children : null}
    </details>
  );
};

export const Properties: FunctionComponent<{
  // @ts-ignore
  object: Match<object, TSerialization>;
}> = ({ object }) => {
  // const $ = useMemo(
  //   () => JSON.stringify('$' in object ? object.$ : undefined),
  //   [object],
  // );

  if (Object.keys(object).length === 0) return null;

  return (
    <tr>
      <td>
        <b>Meta</b>
      </td>
      <td>
        <table>
          {Object.entries(object).map(([key, value]) => {
            if (isObject(value)) return null;
            const level =
              key === 'level'
                ? levelDescription[value as unknown as Level]
                : undefined;

            const valueType =
              key === 'valueType'
                ? valueTypeDescription[value as unknown as ValueType]
                : undefined;

            return (
              <tr>
                <td>{key}</td>
                <td>{level || valueType || JSON.stringify(value)}</td>
              </tr>
            );
          })}
        </table>
      </td>
    </tr>
  );
};

const Emitter: FunctionComponent<{
  object: Match<object, TSerialization>;
}> = ({ object }) => {
  const [object_] = useMatch({ $: 'getter' as const }, object, 0);

  const state = useEmitter(object_?.state);

  if (!object_ || !state) return null;

  return (
    <tr>
      <td>
        <b>Getter</b> <i>{object_.state.reference}</i>
      </td>
      <td>
        <pre>{computed(() => JSON.stringify(state.value))}</pre>
      </td>
    </tr>
  );
};

const Collector: FunctionComponent<{
  object: Match<object, TSerialization>;
}> = ({ object }) => {
  // @ts-ignore
  const object_ = useMatch({ $: 'setter' as const }, object, 0).at(0);

  const valueTypeNamed = object_
    ? valueTypeDescription[object_.valueType]
    : undefined;

  const collector = useCollector(object_?.setState);
  const [input, setInput] = useState<unknown>(undefined);

  if (!object_) return null;

  const onChange: JSX.EventHandler<
    JSX.TargetedEvent<HTMLInputElement, Event>
  > = ({ currentTarget }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    const { value } = currentTarget;

    if (value.length === 0) {
      currentTarget.setCustomValidity('');
      setInput(undefined);

      return;
    }

    try {
      const parsedValue = JSON.parse(value);
      const inputTypeNamed = typeof parsedValue;

      if (inputTypeNamed !== valueTypeNamed) {
        currentTarget.setCustomValidity(
          `parsed type does not match the required type! Needed: ${valueTypeNamed}, parsed: ${inputTypeNamed}`,
        );

        return;
      }

      currentTarget.setCustomValidity('');
      setInput(parsedValue);
    } catch {
      currentTarget.setCustomValidity('invalid input');
    }
  };

  const onSubmit: JSX.GenericEventHandler<HTMLFormElement> = (
    event: JSX.TargetedEvent<HTMLFormElement, Event>,
  ) => {
    event.preventDefault();

    if (input === undefined) return;

    collector(input);
  };

  return (
    <tr>
      <td>
        <b>Setter</b> <i>{object_.setState.reference}</i>
      </td>
      <td>
        {
          // @ts-ignore
          object.valueType === ValueType.NULL ? (
            <button onClick={() => collector(null)}>null</button>
          ) : (
            <form action="#" onSubmit={onSubmit}>
              <input placeholder={valueTypeNamed} onChange={onChange} />
            </form>
          )
        }
      </td>
    </tr>
  );
};

const Child: FunctionComponent<{
  name: string;
  object: Match<object, TSerialization>;
  open: boolean;
}> = ({ name, object, open }) =>
  isPlainObject(object) ? (
    <tr>
      <td colSpan={999}>
        <Details
          open={open}
          summary={
            <>
              <b>Child:</b> {name}
            </>
          }
        >
          {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
          <Hierarchy object={object} />
        </Details>
      </td>
    </tr>
  ) : null;

export const Hierarchy: FunctionComponent<{
  object: Match<object, TSerialization>;
}> = ({ object }) => {
  const openChildList = useMemo(() => {
    if (!('level' in object)) return false;

    switch (object.level) {
      case Level.SYSTEM:
      case Level.HOME:
      case Level.FLOOR: {
        return true;
      }
      default: {
        return false;
      }
    }
  }, [object]);

  return (
    <table>
      <Properties object={object} />
      <Emitter object={object} />
      <Collector object={object} />
      {Object.entries(object).map(([name, child]) => (
        <Child name={name} object={child} open={openChildList} />
      ))}
    </table>
  );
};
