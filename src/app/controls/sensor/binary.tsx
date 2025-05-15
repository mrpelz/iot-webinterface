import { Match, TExclude } from '@iot/iot-monolith/tree';
import { FunctionComponent } from 'preact';

import { TSerialization } from '../../../common/types.js';
import { Tag } from '../../components/controls.js';
import { I18nKey } from '../../i18n/main.js';
import { useTypedEmitter } from '../../state/api.js';
import { Translation } from '../../views/translation.js';
import { CellWithBody } from '../main.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type TBinarySensor = Match<
  {
    $: 'input';
  },
  TExclude,
  TSerialization
>;

export const BinarySensor: FunctionComponent<{
  negativeKey?: I18nKey;
  onClick?: () => void;
  positiveKey?: I18nKey;
  sensor: TBinarySensor;
  title?: I18nKey;
}> = ({ negativeKey = 'no', onClick, positiveKey = 'yes', sensor, title }) => {
  const value = useTypedEmitter(sensor.main).value;

  return (
    <CellWithBody
      onClick={onClick}
      title={<Translation i18nKey={title || sensor.topic} capitalize={true} />}
    >
      <Tag>
        {value === undefined ? (
          '?'
        ) : (
          <Translation i18nKey={value ? positiveKey : negativeKey} />
        )}
      </Tag>
    </CellWithBody>
  );
};
