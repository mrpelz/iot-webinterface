import { Match, TExclude } from '@iot/iot-monolith/tree';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { TSerialization } from '../../../common/types.js';
import { Tag, TagGroup } from '../../components/controls.js';
import { NonBreaking, TabularNums } from '../../components/text.js';
import { I18nKey } from '../../i18n/main.js';
import {
  defaultNumberFormat,
  measuredNumberFormats,
} from '../../i18n/mapping.js';
import { useTypedEmitter } from '../../state/api.js';
import { $i18n } from '../../state/translation.js';
import { Translation } from '../../views/translation.js';
import { CellWithBody } from '../main.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type TNumericSensor = Match<
  {
    $:
      | 'brightness'
      | 'humidity'
      | 'pressure'
      | 'temperature'
      | 'tvoc'
      | 'co2'
      | 'pm025'
      | 'pm10'
      | 'uvIndex';
  },
  TExclude,
  TSerialization
>;

export const NumericSensor: FunctionComponent<{
  onClick?: () => void;
  sensor: TNumericSensor;
  title?: I18nKey;
}> = ({ onClick, sensor, title }) => {
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

  const value = useTypedEmitter(sensor.main).value;
  const formattedValue = useMemo(
    () => (value === undefined ? undefined : numberFormat.format(value)),
    [numberFormat, value],
  );

  return (
    <CellWithBody
      onClick={onClick}
      title={<Translation i18nKey={title || sensor.$} capitalize={true} />}
    >
      <Tag>
        {value === undefined ? (
          '?'
        ) : (
          <NonBreaking>
            <TagGroup>
              <TabularNums>{formattedValue}</TabularNums>
            </TagGroup>
            {sensor.main.unit ? (
              <TagGroup>
                <Translation i18nKey={sensor.main.unit} />
              </TagGroup>
            ) : null}
          </NonBreaking>
        )}
      </Tag>
    </CellWithBody>
  );
};
