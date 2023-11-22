import { FunctionComponent } from 'preact';

import { isOpenSensorElement } from '../../../controls/sensor/open.js';
import { HierarchyElement } from '../../../web-api.js';
import { OpenSensor } from './open.js';

export const SubPage: FunctionComponent<{
  element: HierarchyElement;
}> = ({ element }) => {
  if (isOpenSensorElement(element)) {
    return <OpenSensor element={element}>open sensor element</OpenSensor>;
  }

  return null;
};
