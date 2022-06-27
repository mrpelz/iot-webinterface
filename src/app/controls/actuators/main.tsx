import { BinaryActuator, isBinaryActuatorElement } from './binary.js';
import {
  BrightnessActuator,
  isBrightnessActuatorElement,
} from './brightness.js';
import { NullActuator, isNullActuatorElement } from './null.js';
import { FunctionComponent } from 'preact';
import { HierarchyElementPropertyActuator } from '../../web-api.js';
import { I18nKey } from '../../i18n/main.js';

export const Actuator: FunctionComponent<{
  element: HierarchyElementPropertyActuator;
  onClick?: () => void;
  title?: I18nKey;
}> = ({ element, onClick, title }) => {
  if (isBrightnessActuatorElement(element)) {
    return (
      <BrightnessActuator element={element} onClick={onClick} title={title} />
    );
  }

  if (isBinaryActuatorElement(element)) {
    return <BinaryActuator element={element} onClick={onClick} title={title} />;
  }

  if (isNullActuatorElement(element)) {
    return <NullActuator element={element} onClick={onClick} title={title} />;
  }

  return null;
};
