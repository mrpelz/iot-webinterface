import {
  BinaryActuatorElement,
  isBinaryActuatorElement,
} from './binary-actuator.js';
import { BodyLarge, useColorBody } from '../../components/controls.js';
import {
  HierarchyElement,
  HierarchyElementPropertyActuator,
  ValueType,
  isMetaPropertyActuator,
} from '../../web-api.js';
import { NonBreaking, TabularNums } from '../../components/text.js';
import { useCallback, useEffect, useMemo, useRef } from 'preact/hooks';
import {
  useChildGetter,
  useChildSetter,
  useGetter,
} from '../../state/web-api.js';
import { BlendOver } from '../../components/blend-over.js';
import { Cell } from './main.js';
import { FunctionComponent } from 'preact';
import { I18nKey } from '../../i18n/main.js';
import { Translation } from '../../state/i18n.js';
import { useWheel } from '../../hooks/use-wheel.js';

export type BrightnessActuatorElement = BinaryActuatorElement & {
  children: {
    brightness: HierarchyElementPropertyActuator & {
      meta: { valueType: ValueType.NUMBER };
    };
  };
};

export const isBrightnessActuatorElement = (
  element: HierarchyElement
): element is BrightnessActuatorElement =>
  Boolean(
    isBinaryActuatorElement(element) &&
      element.children &&
      'brightness' in element.children &&
      isMetaPropertyActuator(element.children.brightness.meta) &&
      element.children.brightness.meta.valueType === ValueType.NUMBER
  );

export const BrightnessLabel: FunctionComponent<{
  brightness: number | null;
  loading: boolean | null;
  value: boolean | null;
}> = ({ brightness, loading, value }) => {
  return (
    <NonBreaking>
      {useMemo(() => {
        if (value === null || brightness === null) return '?';
        if (loading) return '…';

        return <TabularNums>{Math.round(brightness * 100)}%</TabularNums>;
      }, [brightness, loading, value])}
    </NonBreaking>
  );
};

export const BrightnessActuator: FunctionComponent<{
  element: BrightnessActuatorElement;
  title?: I18nKey;
}> = ({ element, title }) => {
  const {
    property,
    meta: { actuated },
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
  const handleWheel = useCallback(
    (delta: number) => {
      const { current: currentBrightness } = brightnessRef;
      const { current: currentLoading } = loadingRef;

      if (!setBrightness) return;
      if (currentBrightness === null) return;
      if (currentLoading) return;

      const newValue = Math.min(
        Math.max(currentBrightness + delta * 0.01, 0),
        1
      );

      setBrightness(newValue);
    },
    [setBrightness]
  );

  const refA = useRef<HTMLElement | null>(null);
  const refB = useRef<HTMLElement | null>(null);

  useWheel(refA, handleWheel);
  useWheel(refB, handleWheel);

  const ColorBody = useColorBody(BodyLarge, property, actuated);

  const label = (
    <BrightnessLabel brightness={brightness} loading={loading} value={value} />
  );

  return (
    <Cell
      includeBody={false}
      onClick={flip ? handleClick : undefined}
      title={<Translation i18nKey={title || property} capitalize={true} />}
    >
      <BlendOver
        blendOver={brightness === null ? 0 : brightness}
        overlay={<ColorBody ref={refA}>{label}</ColorBody>}
      >
        <BodyLarge ref={refB}>{label}</BodyLarge>
      </BlendOver>
    </Cell>
  );
};
