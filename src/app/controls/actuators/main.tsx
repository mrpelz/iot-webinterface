import { FunctionComponent } from 'preact';

import { AnyObject } from '../../api.js';
import { I18nKey } from '../../i18n/main.js';
import { BinaryActuator, TBinaryActuator } from './binary.js';
import { BrightnessActuator, TBrightnessActuator } from './brightness.js';
import { NullActuator, TNullActuator } from './null.js';
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
    case 'outputGrouping': {
      return (
        <BinaryActuator actuator={object} onClick={onClick} title={title} />
      );
    }
    case 'led':
    case 'ledGrouping': {
      return (
        <BrightnessActuator actuator={object} onClick={onClick} title={title} />
      );
    }
    case 'triggerElement': {
      return <NullActuator actuator={object} onClick={onClick} title={title} />;
    }
    // fake correct species as long as there’s no RGB lights present
    case 'rgb' as typeof object.$: {
      return (
        <RGBActuator
          // fake correct object shape as long as there’s no RGB lights present
          actuator={object as TRGBActuator}
          onClick={onClick}
          title={title}
        />
      );
    }
    default: {
      return null;
    }
  }
};
