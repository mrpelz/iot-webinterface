import { Match, TExclude } from '@iot/iot-monolith/tree';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { TSystem } from '../../../common/types.js';
import { serialized } from '../../api.js';
import { Tag } from '../../components/controls.js';
import { TabularNums } from '../../components/text.js';
import { useTypedEmitter } from '../../hooks/use-api.js';
import { I18nKey } from '../../i18n/main.js';
import {
  defaultNumberFormat,
  measuredNumberFormats,
} from '../../i18n/mapping.js';
import { $i18n } from '../../state/translation.js';
import { Translation } from '../../views/translation.js';
import { CellWithBody } from '../main.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type THMMDMotionSensor = Match<
  {
    $: 'hmmdMotion';
  },
  TExclude,
  TSystem
>;

export const HMMDMotionSensor: FunctionComponent<{
  negativeKey?: I18nKey;
  onClick?: () => void;
  positiveKey?: I18nKey;
  sensor: THMMDMotionSensor;
  title?: I18nKey;
}> = ({ negativeKey = 'no', onClick, positiveKey = 'yes', sensor, title }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const name = String(title ?? sensor.$path?.at(-1) ?? sensor.$);

  const {
    value: { translationLanguage, translationLocale },
  } = $i18n;
  const effectiveLocale = useMemo(
    () => translationLocale || translationLanguage,
    [translationLanguage, translationLocale],
  );

  const numberFormat = useMemo(
    () =>
      new Intl.NumberFormat(
        effectiveLocale,
        sensor.$ in measuredNumberFormats
          ? measuredNumberFormats[sensor.$]
          : defaultNumberFormat,
      ),
    [effectiveLocale, sensor.$],
  );

  const value = useTypedEmitter(serialized(sensor.main)).value;

  const distanceValue = useTypedEmitter(serialized(sensor.distance.main)).value;
  const formattedDistanceValue = useMemo(
    () =>
      distanceValue === undefined
        ? undefined
        : numberFormat.format(distanceValue),
    [numberFormat, distanceValue],
  );

  return (
    <CellWithBody
      title={
        <Translation
          capitalize={true}
          i18nKey={name}
        />
      }
      onClick={onClick}
    >
      <Tag>
        {value === undefined ? (
          '?'
        ) : (
          <Translation i18nKey={value ? positiveKey : negativeKey} />
        )}
      </Tag>
      {distanceValue ? (
        <Tag>
          <TabularNums>{formattedDistanceValue}</TabularNums>
        </Tag>
      ) : null}
    </CellWithBody>
  );
};
