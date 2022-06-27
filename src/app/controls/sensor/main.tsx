import { BinarySensor, isBinarySensorElement } from './binary.js';
import { NumericSensor, isNumericSensorElement } from './numeric.js';
import { FunctionComponent } from 'preact';
import { HierarchyElementPropertySensor } from '../../web-api.js';
import { I18nKey } from '../../i18n/main.js';

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
