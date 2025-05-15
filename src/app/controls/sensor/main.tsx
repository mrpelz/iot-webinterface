import { FunctionComponent } from 'preact';

import { AnyObject } from '../../api.js';
import { I18nKey } from '../../i18n/main.js';
import { BinarySensor } from './binary.js';
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
    case 'input': {
      return <BinarySensor sensor={object} onClick={onClick} title={title} />;
    }
    case 'door':
    case 'window': {
      return <OpenSensor sensor={object} onClick={onClick} title={title} />;
    }
    case 'brightness':
    case 'humidity':
    case 'pressure':
    case 'temperature':
    case 'tvoc':
    case 'co2':
    case 'pm025':
    case 'pm10':
    case 'uvIndex': {
      return <NumericSensor sensor={object} onClick={onClick} title={title} />;
    }
    default: {
      return null;
    }
  }
};
