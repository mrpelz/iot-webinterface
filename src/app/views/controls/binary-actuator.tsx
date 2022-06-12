import {
  HierarchyElement,
  HierarchyElementPropertyActuator,
  ValueType,
  isMetaPropertyActuator,
} from '../../web-api.js';
import {
  useChildGetter,
  useChildSetter,
  useGetter,
} from '../../state/web-api.js';
import { BlendOver } from '../../components/blend-over.js';
import { Body } from '../../components/controls.js';
import { Cell } from './main.js';
import { FunctionComponent } from 'preact';
import { I18nKey } from '../../i18n/main.js';
import { Translation } from '../../state/i18n.js';
import { colors } from '../../style.js';
import { useCallback } from 'preact/hooks';

export type BinaryActuatorElement = HierarchyElementPropertyActuator & {
  meta: { valueType: ValueType.BOOLEAN };
};

export const isBinaryActuatorElement = (
  element: HierarchyElement
): element is BinaryActuatorElement =>
  isMetaPropertyActuator(element.meta) &&
  element.meta.valueType === ValueType.BOOLEAN;

export const BinaryActuator: FunctionComponent<{
  element: BinaryActuatorElement;
  negativeKey?: I18nKey;
  positiveKey?: I18nKey;
  title?: I18nKey;
}> = ({ element, negativeKey = 'off', positiveKey = 'on', title }) => {
  const overlayFontColor = colors.fontPrimary(undefined, 'light')();

  const { property } = element;

  const value = useGetter<boolean>(element);

  const loading = useChildGetter<boolean>(element, 'loading');

  const flip = useChildSetter<null>(element, 'flip');
  const handleClick = useCallback(() => flip?.(null), [flip]);

  return (
    <Cell
      includeBody={false}
      onClick={flip ? handleClick : undefined}
      title={<Translation i18nKey={title || property} capitalize={true} />}
    >
      <BlendOver
        blendOver={value ? 1 : 0}
        overlay={
          <Body backgroundColor="hsl(40, 100%, 50%)" color={overlayFontColor}>
            <Translation i18nKey={positiveKey} />
          </Body>
        }
      >
        <Body>
          {value === null ? (
            '?'
          ) : (
            <>
              <Translation i18nKey={negativeKey} />
              {loading ? '…' : null}
            </>
          )}
        </Body>
      </BlendOver>
    </Cell>
  );
};
