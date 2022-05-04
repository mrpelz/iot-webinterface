import { HierarchyElementPropertyActuator, ValueType } from '../../web-api.js';
import {
  useChildGetter,
  useChildSetter,
  useGetter,
} from '../../state/web-api.js';
import { Cell } from './main.js';
import { FunctionComponent } from 'preact';
import { I18nKey } from '../../i18n/main.js';
import { Translation } from '../../state/i18n.js';
import { useCallback } from 'preact/hooks';

export type BinaryActuatorElement = HierarchyElementPropertyActuator & {
  meta: { valueType: ValueType.BOOLEAN };
};

export const isBinaryActuatorElement = (
  element: HierarchyElementPropertyActuator
): element is BinaryActuatorElement =>
  element.meta.valueType === ValueType.BOOLEAN;

export const BinaryActuator: FunctionComponent<{
  element: BinaryActuatorElement;
  negativeKey?: I18nKey;
  positiveKey?: I18nKey;
  title?: I18nKey;
}> = ({ element, negativeKey = 'off', positiveKey = 'on', title }) => {
  const { key } = element;

  const value = useGetter<boolean>(element);

  const loading = useChildGetter<boolean>(element, 'loading');

  const flip = useChildSetter<null>(element, 'flip');
  const handleClick = useCallback(() => flip?.(null), [flip]);

  return (
    <Cell
      title={<Translation i18nKey={title || key} capitalize={true} />}
      onClick={flip ? handleClick : undefined}
    >
      {value === null ? (
        '?'
      ) : (
        <>
          <Translation i18nKey={value ? positiveKey : negativeKey} />
          {loading ? '…' : null}
        </>
      )}
    </Cell>
  );
};
