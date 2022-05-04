import { HierarchyElementPropertySensor, ValueType } from '../../web-api.js';
import { NonBreaking, TabularNums } from '../../components/text.js';
import { Translation, useI18n } from '../../state/i18n.js';
import { Cell } from './main.js';
import { FunctionComponent } from 'preact';
import { I18nKey } from '../../i18n/main.js';
import { useGetter } from '../../state/web-api.js';
import { useMemo } from 'preact/hooks';

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
  element: HierarchyElementPropertySensor
): element is NumericSensorElement =>
  Boolean(element.meta.valueType === ValueType.NUMBER && element.meta.measured);

export const NumericSensor: FunctionComponent<{
  element: NumericSensorElement;
  title?: I18nKey;
}> = ({ element, title }) => {
  const {
    meta: { measured, unit },
  } = element;

  const { translationLanguage, translationLocale } = useI18n();
  const effectiveLocale = useMemo(
    () => translationLocale || translationLanguage,
    [translationLanguage, translationLocale]
  );

  const numberFormat = useMemo(
    () => new Intl.NumberFormat(effectiveLocale),
    [effectiveLocale]
  );

  const value = useGetter<number>(element);
  const formattedValue = useMemo(
    () => (value === null ? null : numberFormat.format(value)),
    [numberFormat, value]
  );

  return (
    <Cell title={<Translation i18nKey={title || measured} capitalize={true} />}>
      {value === null ? (
        '?'
      ) : (
        <NonBreaking>
          <TabularNums>{formattedValue}</TabularNums>
          {unit ? (
            <>
              {' '}
              <Translation i18nKey={unit} />
            </>
          ) : null}
        </NonBreaking>
      )}
    </Cell>
  );
};
