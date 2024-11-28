import { FunctionComponent } from 'preact';
import {
  Dispatch,
  MutableRef,
  StateUpdater,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';

import { BlendOver } from '../../components/blend-over.js';
import { BodyLarge } from '../../components/controls.js';
import { NonBreaking, TabularNums } from '../../components/text.js';
import { useColorBody } from '../../hooks/use-color-body.js';
import { useDelay } from '../../hooks/use-delay.js';
import { useSwipe } from '../../hooks/use-swipe.js';
import { useWheel } from '../../hooks/use-wheel.js';
import { I18nKey } from '../../i18n/main.js';
import { Translation } from '../../state/i18n.js';
import { useSegment } from '../../state/path.js';
import {
  SetterFunction,
  useChildGetter,
  useChildSetter,
  useGetter,
} from '../../state/web-api.js';
import {
  HierarchyElement,
  HierarchyElementPropertyActuator,
  isMetaPropertyActuator,
  ValueType,
} from '../../web-api.js';
import { Cell } from '../main.js';
import { BinaryActuatorElement, isBinaryActuatorElement } from './binary.js';

export type BrightnessActuatorElement = BinaryActuatorElement & {
  children: {
    brightness: HierarchyElementPropertyActuator & {
      meta: { valueType: ValueType.NUMBER };
    };
  };
};

export const isBrightnessActuatorElement = (
  element: HierarchyElement,
): element is BrightnessActuatorElement =>
  Boolean(
    isBinaryActuatorElement(element) &&
      element.children &&
      'brightness' in element.children &&
      isMetaPropertyActuator(element.children.brightness.meta) &&
      element.children.brightness.meta.valueType === ValueType.NUMBER,
  );

export const useWheelBrightness = (
  brightnessRef: MutableRef<number | null>,
  loadingRef: MutableRef<boolean | null>,
  setBrightness: SetterFunction<number> | null,
): ((delta: number) => void) =>
  useCallback(
    (delta) => {
      const { current: currentBrightness } = brightnessRef;
      const { current: currentLoading } = loadingRef;

      if (!setBrightness) return;
      if (currentLoading) return;

      const newValue =
        Math.round(
          Math.min(Math.max((currentBrightness || 0) + delta * 0.005, 0), 1) *
            100,
        ) / 100;

      if (newValue === currentBrightness) return;

      setBrightness(newValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setBrightness],
  );

export const useSwipeBrightness = (
  brightnessRef: MutableRef<number | null>,
  loadingRef: MutableRef<boolean | null>,
  setBrightness: SetterFunction<number> | null,
  setInteracting: Dispatch<StateUpdater<boolean>>,
): ((delta: number | null) => void) => {
  const startBrightnessRef = useRef<number | null>(null);

  return useCallback(
    (delta) => {
      const { current: currentBrightness } = brightnessRef;
      const { current: currentLoading } = loadingRef;

      if (currentBrightness === null) return;
      if (currentLoading) return;
      if (!setBrightness) return;

      if (delta === 0) {
        setInteracting(true);
        return;
      }

      if (delta === null) {
        startBrightnessRef.current = null;
        setInteracting(false);
        return;
      }

      const { current: startBrightness } = startBrightnessRef;

      const brightness =
        startBrightness === null ? currentBrightness : startBrightness;

      const newValue =
        Math.round(Math.min(Math.max(brightness + delta, 0), 1) * 100) / 100;

      if (newValue === currentBrightness) return;

      setBrightness(newValue);

      startBrightnessRef.current = brightness;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setBrightness],
  );
};

export const BrightnessLabel: FunctionComponent<{
  brightness: number | null;
  loading: boolean | null;
  value: boolean | null;
}> = ({ brightness, loading, value }) => (
  <NonBreaking>
    {useMemo(() => {
      if (value === null || brightness === null) return '?';
      if (loading) return '…';

      return <TabularNums>{Math.round(brightness * 100)}%</TabularNums>;
    }, [brightness, loading, value])}
  </NonBreaking>
);

export const BrightnessActuator: FunctionComponent<{
  element: BrightnessActuatorElement;
  onClick?: () => void;
  title?: I18nKey;
}> = ({ element, onClick, title }) => {
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

  const [isInteracting, setInteracting] = useState(false);

  const handleWheel = useWheelBrightness(
    brightnessRef,
    loadingRef,
    setBrightness,
  );
  const handleSwipe = useSwipeBrightness(
    brightnessRef,
    loadingRef,
    setBrightness,
    setInteracting,
  );

  const refA = useRef<HTMLElement | null>(null);
  const refB = useRef<HTMLElement | null>(null);

  useWheel(refA, handleWheel, 100);
  useWheel(refB, handleWheel, 100);

  useSwipe(refA, handleSwipe, 50);
  useSwipe(refB, handleSwipe, 50);

  const ColorBody = useColorBody(BodyLarge, property, actuated);

  const [route] = useSegment(0);
  const allowTransition = Boolean(useDelay(route, 300, true));

  const label = (
    <BrightnessLabel brightness={brightness} loading={loading} value={value} />
  );

  return (
    <Cell
      onClick={flip && !onClick ? handleClick : onClick}
      title={<Translation i18nKey={title || property} capitalize={true} />}
    >
      <BlendOver
        blendOver={brightness === null ? 0 : brightness}
        overlay={<ColorBody ref={refA}>{label}</ColorBody>}
        transition={
          allowTransition && brightness !== null && !loading && !isInteracting
        }
      >
        <BodyLarge ref={refB}>{label}</BodyLarge>
      </BlendOver>
    </Cell>
  );
};
