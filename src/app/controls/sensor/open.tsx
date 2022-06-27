import { BinarySensorElement, isBinarySensorElement } from './binary.js';
import {
  HierarchyElement,
  HierarchyElementArea,
  MetaArea,
  isMetaArea,
} from '../../web-api.js';
import { Tag, TagGroup } from '../../components/controls.js';
import { useChild, useChildGetter, useGetter } from '../../state/web-api.js';
import { CellWithBody } from '../main.js';
import { FunctionComponent } from 'preact';
import { I18nKey } from '../../i18n/main.js';
import { Translation } from '../../state/i18n.js';

export type OpenSensorElement = HierarchyElementArea & {
  children: {
    open: BinarySensorElement;
  };
};

export const isMetaAreaDoor = ({ name }: MetaArea): boolean =>
  ['door', 'entryDoor'].includes(name);
export const isMetaAreaWindow = ({ name }: MetaArea): boolean =>
  name === 'window';

export const isOpenSensorElement = (
  element: HierarchyElement
): element is OpenSensorElement =>
  Boolean(
    isMetaArea(element.meta) &&
      element.children &&
      'open' in element.children &&
      isBinarySensorElement(element.children.open)
  );

export const OpenSensor: FunctionComponent<{
  element: OpenSensorElement;
  negativeKey?: I18nKey;
  onClick?: () => void;
  positiveKey?: I18nKey;
  title?: I18nKey;
}> = ({
  element,
  negativeKey = 'closed',
  onClick,
  positiveKey = 'open',
  title,
}) => {
  const { property } = element;

  const open = useChild(element, 'open') as BinarySensorElement;
  const value = useGetter<boolean>(open);

  const isReceived = useChildGetter<boolean>(open, 'isReceivedValue');

  return (
    <CellWithBody
      onClick={onClick}
      title={<Translation i18nKey={title || property} capitalize={true} />}
    >
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
    </CellWithBody>
  );
};
