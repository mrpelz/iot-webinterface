import { FunctionComponent } from 'preact';

import { I18nKey } from '../../i18n/main.js';
import { HierarchyElementPropertySensor } from '../../web-api.js';
import { BinarySensor, isBinarySensorElement } from './binary.js';
import { isNumericSensorElement, NumericSensor } from './numeric.js';

export const Sensor: FunctionComponent<{
  element: HierarchyElementPropertySensor;
  onClick?: () => void;
  title?: I18nKey;
}> = ({ element, onClick, title }) => {
  if (isBinarySensorElement(element)) {
    return <BinarySensor element={element} onClick={onClick} title={title} />;
  }

  if (isNumericSensorElement(element)) {
    return <NumericSensor element={element} onClick={onClick} title={title} />;
  }

  return null;
};
