import { HierarchyElementPropertySensor, ValueType } from '../../web-api.js';
import { Cell } from './main.js';
import { FunctionComponent } from 'preact';
import { I18nKey } from '../../i18n/main.js';
import { Translation } from '../../state/i18n.js';
import { useGetter } from '../../state/web-api.js';

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

  const value = useGetter<number>(element);

  return (
    <Cell title={<Translation i18nKey={title || measured} capitalize={true} />}>
      {value === null ? (
        '?'
      ) : (
        <>
          {value}
          {unit ? (
            <>
              {' '}
              <Translation i18nKey={unit} />
            </>
          ) : null}
        </>
      )}
    </Cell>
  );
};
