import {
  BrightnessActuatorElement,
  BrightnessLabel,
  isBrightnessActuatorElement,
} from './brightness-actuator.js';
import {
  HierarchyElement,
  HierarchyElementArea,
  MetaArea,
  isMetaArea,
} from '../../web-api.js';
import { useCallback, useMemo } from 'preact/hooks';
import {
  useChild,
  useChildGetter,
  useChildSetter,
  useGetter,
} from '../../state/web-api.js';
import { BlendOver } from '../../components/blend-over.js';
import { BodyLarge } from '../../components/controls.js';
import { Cell } from './main.js';
import { FunctionComponent } from 'preact';
import { I18nKey } from '../../i18n/main.js';
import { OverlayBodies } from './binary-actuator.js';
import { Translation } from '../../state/i18n.js';
import { styled } from 'goober';

export type RGBActuatorElement = HierarchyElementArea & {
  children: Record<'r' | 'g' | 'b', BrightnessActuatorElement>;
};

export const isMetaAreaRGB = ({ name }: MetaArea): boolean =>
  name.toLowerCase().includes('rgb');

export const isRGBActuatorElement = (
  element: HierarchyElement
): element is RGBActuatorElement =>
  Boolean(
    isMetaArea(element.meta) &&
      element.children &&
      'r' in element.children &&
      isBrightnessActuatorElement(element.children.r) &&
      'g' in element.children &&
      isBrightnessActuatorElement(element.children.g) &&
      'b' in element.children &&
      isBrightnessActuatorElement(element.children.b)
  );

const DisableRoundedCorners = styled('disable-rounded-corners' as 'section')`
  display: contents;
  --border-radius: 0;
`;

const ColorWrapper = styled('color-wrapper' as 'section')`
  display: contents;
  cursor: pointer;
`;

const ColorLabel = styled('color-label')`
  flex-grow: 1;
`;

const Color: FunctionComponent<{
  bodyProperty: keyof typeof OverlayBodies;
  childProperty: string;
  element: RGBActuatorElement;
  i18nKey: string;
}> = ({ bodyProperty, childProperty, element, i18nKey }) => {
  const child = useChild(element, childProperty);
  const value = useGetter<boolean>(child);
  const flip = useChildSetter<null>(child, 'flip');
  const handleClick = useCallback(() => flip?.(null), [flip]);
  const loading = useChildGetter<boolean>(child, 'loading');
  const brightness = useChildGetter<number>(child, 'brightness');
  const label = useMemo(
    () => (
      <>
        <ColorLabel>
          <Translation i18nKey={i18nKey} />
        </ColorLabel>
        <BrightnessLabel
          brightness={brightness}
          loading={loading}
          value={value}
        />
      </>
    ),
    [brightness, i18nKey, loading, value]
  );

  const OverlayBody = useMemo(
    () => OverlayBodies[bodyProperty],
    [bodyProperty]
  );

  return (
    <ColorWrapper onClick={handleClick}>
      <BlendOver
        blendOver={brightness === null ? 0 : brightness}
        overlay={<OverlayBody>{label}</OverlayBody>}
      >
        <BodyLarge>{label}</BodyLarge>
      </BlendOver>
    </ColorWrapper>
  );
};

export const RGBActuator: FunctionComponent<{
  element: RGBActuatorElement;
  title?: I18nKey;
}> = ({ element, title }) => {
  const { property } = element;

  return (
    <Cell
      includeBody={false}
      title={<Translation i18nKey={title || property} capitalize={true} />}
    >
      <DisableRoundedCorners>
        <Color
          bodyProperty="lightingRed"
          childProperty="r"
          element={element}
          i18nKey="red"
        />
        <Color
          bodyProperty="lightingGreen"
          childProperty="g"
          element={element}
          i18nKey="green"
        />
      </DisableRoundedCorners>
      <Color
        bodyProperty="lightingBlue"
        childProperty="b"
        element={element}
        i18nKey="blue"
      />
    </Cell>
  );
};
