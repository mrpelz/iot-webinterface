import { FunctionComponent } from 'preact';

import { AnyObject } from '../../../api.js';
import { I18nKey } from '../../../i18n/main.js';
import { BinarySensor } from './binary.js';
import { HMMDMotionSensor } from './hmmd-motion.js';
import { NumericSensor } from './numeric.js';
import { OpenSensor } from './open.js';

export const Sensor: FunctionComponent<{
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  object: AnyObject;
  onClick?: () => void;
  title?: I18nKey;
}> = ({ object, onClick, title }) => {
  if (!('$' in object)) return null;
  switch (object.$) {
    case 'input':
    case 'inputGrouping':
    case 'motion': {
      return object.topic === 'open' ? (
        <BinarySensor
          negativeKey="closed"
          positiveKey="open"
          sensor={object}
          title={title}
          onClick={onClick}
        />
      ) : (
        <BinarySensor
          sensor={object}
          title={title}
          onClick={onClick}
        />
      );
    }
    case 'door':
    case 'window': {
      return (
        <OpenSensor
          sensor={object}
          title={title}
          onClick={onClick}
        />
      );
    }
    // case 'co2':
    // case 'pm025':
    // case 'pm10':
    // case 'uvIndex':
    case 'brightness':
    case 'humidity':
    case 'pressure':
    case 'temperature':
    case 'tvoc': {
      return (
        <NumericSensor
          sensor={object}
          title={title}
          onClick={onClick}
        />
      );
    }
    case 'hmmdMotion': {
      return (
        <HMMDMotionSensor
          sensor={object}
          title={title}
          onClick={onClick}
        />
      );
    }
    default: {
      return null;
    }
  }
};
