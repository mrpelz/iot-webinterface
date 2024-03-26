import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { Tag, TagGroup } from '../../components/controls.js';
import { NonBreaking, TabularNums } from '../../components/text.js';
import { I18nKey } from '../../i18n/main.js';
import {
  defaultNumberFormat,
  measuredNumberFormats,
} from '../../i18n/mapping.js';
import { $i18n, Translation } from '../../state/i18n.js';
import { useGetter } from '../../state/web-api.js';
import { getSignal } from '../../util/signal.js';
import {
  HierarchyElement,
  HierarchyElementPropertySensor,
  isMetaPropertySensor,
  ValueType,
} from '../../web-api.js';
import { CellWithBody } from '../main.js';

export type NumericSensorElement = HierarchyElementPropertySensor & {
  meta: {
    measured: Exclude<
      HierarchyElementPropertySensor['meta']['measured'],
      undefined
    >;
    valueType: ValueType.NUMBER;
  };
};

export const isNumericSensorElement = (
  element: HierarchyElement,
): element is NumericSensorElement =>
  Boolean(
    isMetaPropertySensor(element.meta) &&
      element.meta.valueType === ValueType.NUMBER &&
      element.meta.measured,
  );

export const NumericSensor: FunctionComponent<{
  element: NumericSensorElement;
  onClick?: () => void;
  title?: I18nKey;
}> = ({ element, onClick, title }) => {
  const {
    meta: { measured, unit },
  } = element;

  const { translationLanguage, translationLocale } = getSignal($i18n);
  const effectiveLocale = useMemo(
    () => translationLocale || translationLanguage,
    [translationLanguage, translationLocale],
  );

  const numberFormat = useMemo(
    () =>
      new Intl.NumberFormat(
        effectiveLocale,
        measured && measured in measuredNumberFormats
          ? measuredNumberFormats[measured]
          : defaultNumberFormat,
      ),
    [effectiveLocale, measured],
  );

  const value = useGetter<number>(element);
  const formattedValue = useMemo(
    () => (value === null ? null : numberFormat.format(value)),
    [numberFormat, value],
  );

  return (
    <CellWithBody
      onClick={onClick}
      title={<Translation i18nKey={title || measured} capitalize={true} />}
    >
      <Tag>
        {value === null ? (
          '?'
        ) : (
          <NonBreaking>
            <TagGroup>
              <TabularNums>{formattedValue}</TabularNums>
            </TagGroup>
            {unit ? (
              <TagGroup>
                <Translation i18nKey={unit} />
              </TagGroup>
            ) : null}
          </NonBreaking>
        )}
      </Tag>
    </CellWithBody>
  );
};
