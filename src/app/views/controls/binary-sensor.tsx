import { HierarchyElementPropertySensor, ValueType } from '../../web-api.js';
import { useChildGetter, useGetter } from '../../state/web-api.js';
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
  element: BinarySensorElement;
  negativeKey?: I18nKey;
  positiveKey?: I18nKey;
  title?: I18nKey;
}> = ({ element, negativeKey = 'no', positiveKey = 'yes', title }) => {
  const { key } = element;

  const value = useGetter<boolean>(element);

  const isReceived = useChildGetter<boolean>(element, 'isReceivedValue');

  return (
    <Cell title={<Translation i18nKey={title || key} capitalize={true} />}>
      {value === null ? (
        '?'
      ) : (
        <>
          <Translation i18nKey={value ? positiveKey : negativeKey} />
          {
            // eslint-disable-next-line no-negated-condition
            isReceived !== false ? null : '*'
          }
        </>
      )}
    </Cell>
  );
};
