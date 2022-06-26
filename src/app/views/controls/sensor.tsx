import { BinarySensor, isBinarySensorElement } from './binary-sensor.js';
import {
  HierarchyElementArea,
  HierarchyElementPropertySensor,
} from '../../web-api.js';
import { NumericSensor, isNumericSensorElement } from './numeric-sensor.js';
import { OpenSensor, isOpenSensorElement } from './open-sensor.js';
import { FunctionComponent } from 'preact';
import { I18nKey } from '../../i18n/main.js';

export const Sensor: FunctionComponent<{
  element: HierarchyElementPropertySensor | HierarchyElementArea;
  title?: I18nKey;
}> = ({ element, title }) => {
  if (isOpenSensorElement(element)) {
    return <OpenSensor element={element} title={title} />;
  }

  if (isBinarySensorElement(element)) {
    return <BinarySensor element={element} title={title} />;
  }

  if (isNumericSensorElement(element)) {
    return <NumericSensor element={element} title={title} />;
  }

  return null;
};
