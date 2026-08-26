import { FunctionComponent } from 'preact';

import { AnyObject } from '../../../api.js';
import { I18nKey } from '../../../i18n/main.js';
import { AutomatedInputLogic } from './automated-input-logic.js';
import { BinaryActuator } from './binary.js';
import { BrightnessActuator } from './brightness.js';
import { NullActuator } from './null.js';
import { TimerActuator } from './off-timer.js';
import { RGBActuator, TRGBActuator } from './rgb.js';

export const Actuator: FunctionComponent<{
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  object: AnyObject;
  onClick?: () => void;
  title?: I18nKey;
}> = ({ object, onClick, title }) => {
  if (!('$' in object)) return null;

  switch (object.$) {
    case 'output':
    case 'outputGrouping':
    case 'scene': {
      return (
        <BinaryActuator
          actuator={object}
          title={title}
          onClick={onClick}
        />
      );
    }
    case 'led':
    case 'ledGrouping': {
      return (
        <BrightnessActuator
          actuator={object}
          title={title}
          onClick={onClick}
        />
      );
    }
    case 'triggerElement': {
      return (
        <NullActuator
          actuator={object}
          title={title}
          onClick={onClick}
        />
      );
    }
    // fake correct species as long as there’s no RGB lights present
    case 'rgb' as typeof object.$: {
      return (
        <RGBActuator
          // fake correct object shape as long as there’s no RGB lights present
          actuator={object as TRGBActuator}
          title={title}
          onClick={onClick}
        />
      );
    }
    case 'offTimer': {
      return (
        <TimerActuator
          object={object}
          onClick={onClick}
        />
      );
    }
    case 'automatedInputLogic': {
      return (
        <AutomatedInputLogic
          object={object}
          onClick={onClick}
        />
      );
    }
    default: {
      return null;
    }
  }
};
