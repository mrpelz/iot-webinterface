import { FunctionComponent } from 'preact';

import { I18nKey } from '../../i18n/main.js';
import { BinaryActuator, TBinaryActuator } from './binary.js';
import { BrightnessActuator, TBrightnessActuator } from './brightness.js';
import { NullActuator, TNullActuator } from './null.js';
import { RGBActuator, TRGBActuator } from './rgb.js';

export const Actuator: FunctionComponent<{
  actuator: // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  TBinaryActuator | TBrightnessActuator | TNullActuator | TRGBActuator;
  onClick?: () => void;
  title?: I18nKey;
}> = ({ actuator, onClick, title }) => {
  switch (actuator.$) {
    case 'output': {
      return (
        <BinaryActuator actuator={actuator} onClick={onClick} title={title} />
      );
    }
    case 'led': {
      return (
        <BrightnessActuator
          actuator={actuator}
          onClick={onClick}
          title={title}
        />
      );
    }
    case 'triggerElement': {
      return (
        <NullActuator actuator={actuator} onClick={onClick} title={title} />
      );
    }
    case 'rgb': {
      return (
        <RGBActuator actuator={actuator} onClick={onClick} title={title} />
      );
    }
    default: {
      return null;
    }
  }
};
