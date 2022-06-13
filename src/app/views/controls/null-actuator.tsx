import {
  HierarchyElement,
  HierarchyElementPropertyActuator,
  ValueType,
  isMetaPropertyActuator,
} from '../../web-api.js';
import { useCallback, useEffect, useRef } from 'preact/hooks';
import { BodyLarge } from '../../components/controls.js';
import { Cell } from './main.js';
import { FunctionComponent } from 'preact';
import { I18nKey } from '../../i18n/main.js';
import { Translation } from '../../state/i18n.js';
import { colors } from '../../style.js';
import { forwardRef } from 'preact/compat';
import { styled } from 'goober';
import { useSetter } from '../../state/web-api.js';

export type NullActuatorElement = HierarchyElementPropertyActuator & {
  meta: { valueType: ValueType.NULL };
};

const Body = styled(BodyLarge, forwardRef)`
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;

  @keyframes onTrigger {
    from {
      background-color: ${colors.whiteShaded(80)};
    }

    to {
      background-color: var(--background-color);
    }
  }
`;

export const isNullActuatorElement = (
  element: HierarchyElement
): element is NullActuatorElement =>
  isMetaPropertyActuator(element.meta) &&
  element.meta.valueType === ValueType.NULL;

export const NullActuator: FunctionComponent<{
  element: NullActuatorElement;
  title?: I18nKey;
}> = ({ element, title }) => {
  const { property } = element;

  const setter = useSetter<null>(element);
  const handleClick = useCallback(() => setter?.(null), [setter]);

  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const { current: currentRef } = ref;
    if (!(currentRef instanceof HTMLElement)) return undefined;

    const onClick = () => {
      currentRef.style.animationName = 'onTrigger';

      currentRef.addEventListener(
        'animationend',
        () => (currentRef.style.animationName = ''),
        { once: true }
      );
    };

    currentRef.addEventListener('click', onClick);
    return () => currentRef.removeEventListener('clck', onClick);
  }, []);

  return (
    <Cell
      title={<Translation i18nKey={title || property} capitalize={true} />}
      onClick={setter ? handleClick : undefined}
      includeBody={false}
    >
      <Body ref={ref}>
        <Translation i18nKey="trigger" />
      </Body>
    </Cell>
  );
};
