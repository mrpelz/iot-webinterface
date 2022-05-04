import { BinaryActuator, isBinaryActuatorElement } from './binary-actuator.js';
import { NullActuator, isNullActuatorElement } from './null-actuator.js';
import { FunctionComponent } from 'preact';
import { HierarchyElementPropertyActuator } from '../../web-api.js';
import { I18nKey } from '../../i18n/main.js';

export const Actuator: FunctionComponent<{
  element: HierarchyElementPropertyActuator;
  title?: I18nKey;
}> = ({ element, title }) => {
  if (isBinaryActuatorElement(element)) {
    return <BinaryActuator element={element} title={title} />;
  }

  if (isNullActuatorElement(element)) {
    return <NullActuator element={element} title={title} />;
  }

  return null;
};
