import {
  HierarchyElement,
  HierarchyElementPropertyActuator,
  ValueType,
  isMetaPropertyActuator,
} from '../../web-api.js';
import { useCallback, useMemo } from 'preact/hooks';
import {
  useChildGetter,
  useChildSetter,
  useGetter,
} from '../../state/web-api.js';
import { BlendOver } from '../../components/blend-over.js';
import { BodyLarge } from '../../components/controls.js';
import { Cell } from './main.js';
import { FunctionComponent } from 'preact';
import { I18nKey } from '../../i18n/main.js';
import { Translation } from '../../state/i18n.js';
import { colors } from '../../style.js';
import { styled } from 'goober';

export const OverlayBodies = {
  _: styled(BodyLarge)`
    background-color: ${colors.whiteShaded(80)};
    color: ${colors.fontPrimary(undefined, 'light')};
  `,
  fan: styled(BodyLarge)`
    background-color: hsla(200deg 100% 50% / 80%);
    color: ${colors.fontPrimary(undefined, 'light')};
  `,
  lighting: styled(BodyLarge)`
    background-color: hsla(40deg 100% 50% / 80%);
    color: ${colors.fontPrimary(undefined, 'light')};
  `,
  lightingBlue: styled(BodyLarge)`
    background-color: hsl(240deg 100% 50% / 80%);
    color: ${colors.fontPrimary(undefined, 'dark')};
  `,
  lightingCold: styled(BodyLarge)`
    background-color: hsl(60deg 100% 60% / 80%);
    color: ${colors.fontPrimary(undefined, 'light')};
  `,
  lightingGreen: styled(BodyLarge)`
    background-color: hsl(120deg 100% 50% / 80%);
    color: ${colors.fontPrimary(undefined, 'light')};
  `,
  lightingRed: styled(BodyLarge)`
    background-color: hsl(0deg 100% 50% / 80%);
    color: ${colors.fontPrimary(undefined, 'light')};
  `,
} as const;

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
  const {
    property,
    meta: { actuated },
  } = element;

  const value = useGetter<boolean>(element);

  const loading = useChildGetter<boolean>(element, 'loading');

  const flip = useChildSetter<null>(element, 'flip');
  const handleClick = useCallback(() => flip?.(null), [flip]);

  const OverlayBody = useMemo(() => {
    if (actuated && actuated in OverlayBodies) {
      return OverlayBodies[actuated as keyof typeof OverlayBodies];
    }

    return OverlayBodies._;
  }, [actuated]);

  return (
    <Cell
      includeBody={false}
      onClick={flip ? handleClick : undefined}
      title={<Translation i18nKey={title || property} capitalize={true} />}
    >
      <BlendOver
        blendOver={value ? 1 : 0}
        overlay={
          value === null ? undefined : (
            <OverlayBody>
              <Translation i18nKey={positiveKey} />
            </OverlayBody>
          )
        }
      >
        <BodyLarge>
          {value === null ? (
            '?'
          ) : (
            <>
              <Translation i18nKey={negativeKey} />
              {loading ? '…' : null}
            </>
          )}
        </BodyLarge>
      </BlendOver>
    </Cell>
  );
};
