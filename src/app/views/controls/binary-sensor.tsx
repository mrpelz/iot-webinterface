import {
  HierarchyElement,
  HierarchyElementPropertySensor,
  ValueType,
  isMetaPropertySensor,
} from '../../web-api.js';
import { Cell } from './main.js';
import { FunctionComponent } from 'preact';
import { I18nKey } from '../../i18n/main.js';
import { Tag } from '../../components/controls.js';
import { Translation } from '../../state/i18n.js';
import { useGetter } from '../../state/web-api.js';

export type BinarySensorElement = HierarchyElementPropertySensor & {
  meta: { valueType: ValueType.BOOLEAN };
};

export const isBinarySensorElement = (
  element: HierarchyElement
): element is BinarySensorElement =>
  isMetaPropertySensor(element.meta) &&
  element.meta.valueType === ValueType.BOOLEAN;

export const BinarySensor: FunctionComponent<{
  element: BinarySensorElement;
  negativeKey?: I18nKey;
  positiveKey?: I18nKey;
  title?: I18nKey;
}> = ({ element, negativeKey = 'no', positiveKey = 'yes', title }) => {
  const { property } = element;

  const value = useGetter<boolean>(element);

  return (
    <Cell title={<Translation i18nKey={title || property} capitalize={true} />}>
      <Tag>
        {value === null ? (
          '?'
        ) : (
          <Translation i18nKey={value ? positiveKey : negativeKey} />
        )}
      </Tag>
    </Cell>
  );
};
