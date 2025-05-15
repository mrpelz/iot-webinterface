import { FunctionComponent } from 'preact';

import { AnyObject } from '../../../api.js';
import { OpenSensor } from './open.js';

export const SubPage: FunctionComponent<{
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  object: AnyObject;
}> = ({ object }) => {
  if (!('$' in object)) return null;

  switch (object.$) {
    case 'door':
    case 'window': {
      return <OpenSensor sensor={object}>open sensor element</OpenSensor>;
    }

    default: {
      break;
    }
  }

  return null;
};
