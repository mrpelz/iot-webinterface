import { BinarySensorElement, isBinarySensorElement } from './binary-sensor.js';
import {
  HierarchyElement,
  HierarchyElementArea,
  isMetaArea,
} from '../../web-api.js';
import { Tag, TagGroup } from '../../components/controls.js';
import { useChild, useChildGetter, useGetter } from '../../state/web-api.js';
import { Cell } from './main.js';
import { FunctionComponent } from 'preact';
import { I18nKey } from '../../i18n/main.js';
import { Translation } from '../../state/i18n.js';

export type WindowSensorElement = HierarchyElementArea & {
  children: {
    open: BinarySensorElement;
  };
};

export const isWindowSensorElement = (
  element: HierarchyElement
): element is WindowSensorElement =>
  Boolean(
    isMetaArea(element.meta) &&
      element.children &&
      'open' in element.children &&
      isBinarySensorElement(element.children.open)
  );

export const WindowSensor: FunctionComponent<{
  element: WindowSensorElement;
  negativeKey?: I18nKey;
  positiveKey?: I18nKey;
  title?: I18nKey;
}> = ({ element, negativeKey = 'closed', positiveKey = 'open', title }) => {
  const { property } = element;

  const open = useChild(element, 'open') as BinarySensorElement;
  const value = useGetter<boolean>(open);

  const isReceived = useChildGetter<boolean>(open, 'isReceivedValue');

  return (
    <Cell title={<Translation i18nKey={title || property} capitalize={true} />}>
      <Tag>
        {
          // eslint-disable-next-line no-negated-condition
          value === null || isReceived !== false ? null : (
            <TagGroup>
              <Translation i18nKey="restored" />
            </TagGroup>
          )
        }
        <TagGroup>
          {value === null ? (
            '?'
          ) : (
            <Translation i18nKey={value ? positiveKey : negativeKey} />
          )}
        </TagGroup>
      </Tag>
    </Cell>
  );
};
