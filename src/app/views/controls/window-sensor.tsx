import {
  HierarchyElementArea,
  HierarchyElementPropertySensor,
  Levels,
  ValueType,
} from '../../web-api.js';
import { useChild, useChildGetter, useGetter } from '../../state/web-api.js';
import { Cell } from './main.js';
import { FunctionComponent } from 'preact';
import { I18nKey } from '../../i18n/main.js';
import { Translation } from '../../state/i18n.js';

export type BinarySensorElement = HierarchyElementPropertySensor & {
  meta: { valueType: ValueType.BOOLEAN };
};

export const isWindowSensorElement = (
  element: HierarchyElementPropertySensor | HierarchyElementArea
): element is BinarySensorElement =>
  Boolean(
    element.meta.level === Levels.AREA &&
      element.children &&
      'open' in element.children
  );

export const WindowSensor: FunctionComponent<{
  element: BinarySensorElement;
  negativeKey?: I18nKey;
  positiveKey?: I18nKey;
  title?: I18nKey;
}> = ({ element, negativeKey = 'closed', positiveKey = 'open', title }) => {
  const { property } = element;

  const open = useChild(element, 'open');
  const value = useGetter<boolean>(open);

  const isReceived = useChildGetter<boolean>(open, 'isReceivedValue');

  return (
    <Cell title={<Translation i18nKey={title || property} capitalize={true} />}>
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
