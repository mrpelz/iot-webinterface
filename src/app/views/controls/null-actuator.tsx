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
import { Overlay } from '../../components/overlay.js';
import { Translation } from '../../state/i18n.js';
import { TriggerBody } from '../../components/null-actuator.js';
import { useColorBody } from '../../hooks/use-color-body.js';
import { useSetter } from '../../state/web-api.js';

export type NullActuatorElement = HierarchyElementPropertyActuator & {
  meta: { valueType: ValueType.NULL };
};

export const isNullActuatorElement = (
  element: HierarchyElement
): element is NullActuatorElement =>
  isMetaPropertyActuator(element.meta) &&
  element.meta.valueType === ValueType.NULL;

export const NullActuator: FunctionComponent<{
  element: NullActuatorElement;
  title?: I18nKey;
}> = ({ element, title }) => {
  const {
    property,
    meta: { actuated },
  } = element;

  const setter = useSetter<null>(element);
  const handleClick = useCallback(() => setter?.(null), [setter]);

  const overlayRef = useRef<HTMLElement>(null);
  const baseRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const { current: overlay } = overlayRef;
    const { current: base } = baseRef;

    if (!(overlay instanceof HTMLElement)) return undefined;
    if (!(base instanceof HTMLElement)) return undefined;

    const onClick = async () => {
      const [animationBase, animationOverlay] = await Promise.all([
        base.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 1000,
          easing: 'ease-out',
        }).finished,
        overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 1000,
          easing: 'ease-out',
        }).finished,
      ]);

      animationBase.finish();
      animationOverlay.finish();
    };

    overlay.addEventListener('click', onClick);
    return () => overlay.removeEventListener('clck', onClick);
  }, []);

  const ColorBody = useColorBody(TriggerBody, property, actuated);

  return (
    <Cell
      title={<Translation i18nKey={title || property} capitalize={true} />}
      onClick={setter ? handleClick : undefined}
      includeBody={false}
    >
      <Overlay
        overlay={
          <ColorBody ref={overlayRef}>
            <Translation i18nKey="trigger" />
          </ColorBody>
        }
      >
        <BodyLarge ref={baseRef}>
          <Translation i18nKey="trigger" />
        </BodyLarge>
      </Overlay>
    </Cell>
  );
};
