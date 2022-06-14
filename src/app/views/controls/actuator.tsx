import { BinaryActuator, isBinaryActuatorElement } from './binary-actuator.js';
import {
  BrightnessActuator,
  isBrightnessActuatorElement,
} from './brightness-actuator.js';
import {
  HierarchyElementArea,
  HierarchyElementPropertyActuator,
} from '../../web-api.js';
import { NullActuator, isNullActuatorElement } from './null-actuator.js';
import { RGBActuator, isRGBActuatorElement } from './rgb-actuator.js';
import { FunctionComponent } from 'preact';
import { I18nKey } from '../../i18n/main.js';

export const Actuator: FunctionComponent<{
  element: HierarchyElementPropertyActuator | HierarchyElementArea;
  title?: I18nKey;
}> = ({ element, title }) => {
  if (isRGBActuatorElement(element)) {
    return <RGBActuator element={element} title={title} />;
  }

  if (isBrightnessActuatorElement(element)) {
    return <BrightnessActuator element={element} title={title} />;
  }

  if (isBinaryActuatorElement(element)) {
    return <BinaryActuator element={element} title={title} />;
  }

  if (isNullActuatorElement(element)) {
    return <NullActuator element={element} title={title} />;
  }

  return null;
};
