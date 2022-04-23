import { HierarchyElementPropertySensor, ValueType } from '../../web-api.js';
import { useChild, useGetter } from '../../state/web-api.js';
import { Cell } from './main.js';
import { FunctionComponent } from 'preact';
import { I18nKey } from '../../i18n/main.js';
import { Translation } from '../../state/i18n.js';

export enum BinarySensorLabeling {
  OPEN_CLOSED,
  YES_NO,
  CONNECTED_DISCONNECTED,
}

const binarySensorLabelKeys: Record<BinarySensorLabeling, [I18nKey, I18nKey]> =
  {
    [BinarySensorLabeling.OPEN_CLOSED]: ['open', 'closed'],
    [BinarySensorLabeling.YES_NO]: ['yes', 'no'],
    [BinarySensorLabeling.CONNECTED_DISCONNECTED]: [
      'connected',
      'disconnected',
    ],
  };

export const BinarySensor: FunctionComponent<{
  element: HierarchyElementPropertySensor;
  labeling?: BinarySensorLabeling;
  titleKey?: I18nKey;
}> = ({ element, labeling = BinarySensorLabeling.YES_NO, titleKey }) => {
  const {
    meta: { measured, name, valueType },
  } = element;

  const value = useGetter<boolean>(
    valueType === ValueType.BOOLEAN ? element : null
  );

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
    <Cell
      title={
        <Translation i18nKey={titleKey || measured || name} capitalize={true} />
      }
    >
      {value === null ? (
        '?'
      ) : (
        <>
          <Translation
            i18nKey={binarySensorLabelKeys[labeling][value ? 0 : 1]}
          />
          {isReceivedValue ? null : '*'}
        </>
      )}
    </Cell>
  );
};
