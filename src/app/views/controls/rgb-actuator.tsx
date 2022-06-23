import {
  BodyDisableRoundedCorners,
  ColorLabel,
  RGBBody,
} from '../../components/rgb-actuator.js';
import {
  BrightnessActuatorElement,
  BrightnessLabel,
  isBrightnessActuatorElement,
  useSwipeBrightness,
  useWheelBrightness,
} from './brightness-actuator.js';
import {
  HierarchyElement,
  HierarchyElementArea,
  MetaArea,
  isMetaArea,
} from '../../web-api.js';
import { useCallback, useEffect, useMemo, useRef } from 'preact/hooks';
import {
  useChild,
  useChildGetter,
  useChildSetter,
  useGetter,
} from '../../state/web-api.js';
import { BlendOver } from '../../components/blend-over.js';
import { Cell } from './main.js';
import { FunctionComponent } from 'preact';
import { I18nKey } from '../../i18n/main.js';
import { StyledVNode } from 'goober';
import { Translation } from '../../state/i18n.js';
import { useColorBody } from '../../hooks/use-color-body.js';
import { useSwipe } from '../../hooks/use-swipe.js';
import { useWheel } from '../../hooks/use-wheel.js';

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

const Color: FunctionComponent<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  base?: StyledVNode<any>;
  element: BrightnessActuatorElement;
}> = ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  base: Base = RGBBody,
  element,
}) => {
  const {
    meta: { actuated },
    property,
  } = element;

  const value = useGetter<boolean>(element);

  const brightness = useChildGetter<number>(element, 'brightness');
  const brightnessRef = useRef(brightness);
  useEffect(() => {
    brightnessRef.current = brightness;
  }, [brightness]);

  const loading = useChildGetter<boolean>(element, 'loading');
  const loadingRef = useRef(loading);
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const flip = useChildSetter<null>(element, 'flip');
  const handleClick = useCallback(() => flip?.(null), [flip]);

  const setBrightness = useChildSetter<number>(element, 'brightness');

  const handleWheel = useWheelBrightness(
    brightnessRef,
    loadingRef,
    setBrightness
  );
  const handleSwipe = useSwipeBrightness(
    brightnessRef,
    loadingRef,
    setBrightness
  );

  const refA = useRef<HTMLElement | null>(null);
  const refB = useRef<HTMLElement | null>(null);

  useWheel(refA, handleWheel, 100);
  useWheel(refB, handleWheel, 100);

  useSwipe(refA, handleSwipe, 100);
  useSwipe(refB, handleSwipe, 100);

  const label = useMemo(
    () => (
      <>
        <ColorLabel>
          <Translation i18nKey={property} />
        </ColorLabel>
        <BrightnessLabel
          brightness={brightness}
          loading={loading}
          value={value}
        />
      </>
    ),
    [brightness, loading, property, value]
  );

  const ColorBody = useColorBody(Base, property, actuated);

  return (
    <BlendOver
      blendOver={brightness === null ? 0 : brightness}
      overlay={
        <ColorBody onClick={handleClick} ref={refA}>
          {label}
        </ColorBody>
      }
    >
      <Base onClick={handleClick} ref={refB}>
        {label}
      </Base>
    </BlendOver>
  );
};

export const RGBActuator: FunctionComponent<{
  element: RGBActuatorElement;
  title?: I18nKey;
}> = ({ element, title }) => {
  const { property } = element;

  const r = useChild(element, 'r') as BrightnessActuatorElement | null;
  const g = useChild(element, 'g') as BrightnessActuatorElement | null;
  const b = useChild(element, 'b') as BrightnessActuatorElement | null;

  if (!r || !g || !b) return null;

  return (
    <Cell
      includeBody={false}
      title={<Translation i18nKey={title || property} capitalize={true} />}
    >
      <Color base={BodyDisableRoundedCorners} element={r} />
      <Color base={BodyDisableRoundedCorners} element={g} />
      <Color element={b} />
    </Cell>
  );
};
