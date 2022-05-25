import {
  HierarchyElement,
  HierarchyElementPropertyActuator,
  ValueType,
  isMetaPropertyActuator,
} from '../../web-api.js';
import { Cell } from './main.js';
import { FunctionComponent } from 'preact';
import { I18nKey } from '../../i18n/main.js';
import { Translation } from '../../state/i18n.js';
import { useCallback } from 'preact/hooks';
import { useSetter } from '../../state/web-api.js';

export type NullActuatorElement = HierarchyElementPropertyActuator & {
  meta: { valueType: ValueType.NULL };
};

export const isNullActuatorElement = (
  element: HierarchyElement
): element is NullActuatorElement =>
  isMetaPropertyActuator(element.meta) &&
  element.meta.valueType === ValueType.NULL;

export const NullActuator: FunctionComponent<{
  element: NullActuatorElement;
  title?: I18nKey;
}> = ({ element, title }) => {
  const { property } = element;

  const setter = useSetter<null>(element);
  const handleClick = useCallback(() => setter?.(null), [setter]);

  return (
    <Cell
      title={<Translation i18nKey={title || property} capitalize={true} />}
      onClick={setter ? handleClick : undefined}
    >
      <Translation i18nKey="trigger" />
    </Cell>
  );
};
