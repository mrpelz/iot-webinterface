import { HierarchyElementPropertySensor, ValueType } from '../../web-api.js';
import { useChild, useGetter } from '../../state/web-api.js';
import { Cell } from './main.js';
import { FunctionComponent } from 'preact';
import { I18nKey } from '../../i18n/main.js';
import { Translation } from '../../state/i18n.js';

export type BinarySensorElement = HierarchyElementPropertySensor & {
  meta: { valueType: ValueType.BOOLEAN };
};

export const isBinarySensorElement = (
  element: HierarchyElementPropertySensor
): element is BinarySensorElement =>
  element.meta.valueType === ValueType.BOOLEAN;

export const BinarySensor: FunctionComponent<{
  element: HierarchyElementPropertySensor & {
    meta: { valueType: ValueType.BOOLEAN };
  };
  title?: I18nKey;
}> = ({ element, title }) => {
  const { key } = element;

  const value = useGetter<boolean>(element);

  const isReceivedChild = useChild(
    element,
    'isReceivedValue'
  ) as HierarchyElementPropertySensor | null;
  const isReceivedValue = useGetter<boolean>(
    isReceivedChild?.meta.valueType === ValueType.BOOLEAN
      ? isReceivedChild
      : null
  );

  return (
    <Cell title={<Translation i18nKey={title || key} capitalize={true} />}>
      {value === null ? (
        '?'
      ) : (
        <>
          <Translation i18nKey={value ? 'yes' : 'no'} />
          {!isReceivedChild || isReceivedValue ? null : '*'}
        </>
      )}
    </Cell>
  );
};
