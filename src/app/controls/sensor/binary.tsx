import { Match, TExclude } from '@iot/iot-monolith/tree';
import { FunctionComponent } from 'preact';

import { TSystem } from '../../../common/types.js';
import { serialized } from '../../api.js';
import { Tag } from '../../components/controls.js';
import { useTypedEmitter } from '../../hooks/use-api.js';
import { I18nKey } from '../../i18n/main.js';
import { Translation } from '../../views/translation.js';
import { CellWithBody } from '../main.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type TBinarySensor = Match<
  {
    $: 'input' | 'inputGrouping' | 'motion' | 'hmmdMotion';
  },
  TExclude,
  TSystem
>;

export const BinarySensor: FunctionComponent<{
  negativeKey?: I18nKey;
  onClick?: () => void;
  positiveKey?: I18nKey;
  sensor: TBinarySensor;
  title?: I18nKey;
}> = ({ negativeKey = 'no', onClick, positiveKey = 'yes', sensor, title }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const name = String(title ?? sensor.$path?.at(-1) ?? sensor.$);

  const value = useTypedEmitter(serialized(sensor.main)).value;

  return (
    <CellWithBody
      onClick={onClick}
      title={<Translation i18nKey={name} capitalize={true} />}
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
