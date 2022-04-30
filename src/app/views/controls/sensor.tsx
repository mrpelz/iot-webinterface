import { BinarySensor, isBinarySensorElement } from './binary-sensor.js';
import { NumericSensor, isNumericSensorElement } from './numeric-sensor.js';
import { FunctionComponent } from 'preact';
import { HierarchyElementPropertySensor } from '../../web-api.js';
import { I18nKey } from '../../i18n/main.js';

export const Sensor: FunctionComponent<{
  element: HierarchyElementPropertySensor;
  title?: I18nKey;
}> = ({ element, title }) => {
  if (isBinarySensorElement(element)) {
    return <BinarySensor element={element} title={title} />;
  }

  if (isNumericSensorElement(element)) {
    return <NumericSensor element={element} title={title} />;
  }

  return null;
};
