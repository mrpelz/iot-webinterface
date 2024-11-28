import { FunctionComponent } from 'preact';

import { Match } from '../../api.js';
import { Tag } from '../../components/controls.js';
import { useTypedEmitter } from '../../hooks/use-interaction.js';
import { I18nKey } from '../../i18n/main.js';
import { Translation } from '../../views/translation.js';
import { CellWithBody } from '../main.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type TBinarySensor = Match<{
  $: 'input';
}>;

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
        {value === null ? (
          '?'
        ) : (
          <Translation i18nKey={value ? positiveKey : negativeKey} />
        )}
      </Tag>
    </CellWithBody>
  );
};
