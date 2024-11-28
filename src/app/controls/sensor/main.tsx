import { FunctionComponent } from 'preact';

import { I18nKey } from '../../i18n/main.js';
import { BinarySensor, TBinarySensor } from './binary.js';
import { NumericSensor, TNumericSensor } from './numeric.js';
import { OpenSensor, TOpenSensor } from './open.js';

export const Sensor: FunctionComponent<{
  onClick?: () => void;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  sensor: TBinarySensor | TNumericSensor | TOpenSensor;
  title?: I18nKey;
}> = ({ onClick, sensor, title }) => {
  switch (sensor.$) {
    case 'input': {
      return <BinarySensor sensor={sensor} onClick={onClick} title={title} />;
    }
    case 'door':
    case 'window': {
      return <OpenSensor sensor={sensor} onClick={onClick} title={title} />;
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
      return <NumericSensor sensor={sensor} onClick={onClick} title={title} />;
    }
    default: {
      return null;
    }
  }
};
