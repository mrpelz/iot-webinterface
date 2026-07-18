import { FunctionComponent } from 'preact';

import { AnyObject } from '../../../api.js';
import { BinarySensor } from './binary.js';
import { OffTimer } from './off-timer.js';
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
      return <OpenSensor sensor={object} />;
    }

    case 'offTimer': {
      return <OffTimer actuator={object} />;
    }

    case 'input':
    case 'inputGrouping':
    case 'motion':
    case 'hmmdMotion': {
      return <BinarySensor sensor={object} />;
    }

    default: {
      break;
    }
  }

  return null;
};
