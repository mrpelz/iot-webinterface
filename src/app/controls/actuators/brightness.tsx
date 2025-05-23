import { Match, TExclude } from '@iot/iot-monolith/tree';
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

import { TSerialization } from '../../../common/types.js';
import { BlendOver } from '../../components/blend-over.js';
import { BodyLarge } from '../../components/controls.js';
import { NonBreaking, TabularNums } from '../../components/text.js';
import { useColorBody } from '../../hooks/use-color-body.js';
import { useDelay } from '../../hooks/use-delay.js';
import { useSwipe } from '../../hooks/use-swipe.js';
import { useWheel } from '../../hooks/use-wheel.js';
import { I18nKey } from '../../i18n/main.js';
import { useTypedCollector, useTypedEmitter } from '../../state/api.js';
import { $rootPath } from '../../state/path.js';
import { Translation } from '../../views/translation.js';
import { Cell } from '../main.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type TBrightnessActuator = Match<
  {
    $: 'led' | 'ledGrouping';
  },
  TExclude,
  TSerialization
>;

export const useWheelBrightness = (
  brightnessRef: MutableRef<number | undefined>,
  loadingRef: MutableRef<boolean | undefined>,
  setBrightness: (brightness: number) => void | undefined,
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
  brightnessRef: MutableRef<number | undefined>,
  loadingRef: MutableRef<boolean | undefined>,
  setBrightness: (brightness: number) => void | undefined,
  setInteracting: Dispatch<StateUpdater<boolean>>,
): ((delta: number | undefined) => void) => {
  const startBrightnessRef = useRef<number | undefined>(undefined);

  return useCallback(
    (delta) => {
      const { current: currentBrightness } = brightnessRef;
      const { current: currentLoading } = loadingRef;

      if (currentBrightness === undefined) return;
      if (currentLoading) return;
      if (!setBrightness) return;

      if (delta === 0) {
        setInteracting(true);
        return;
      }

      if (delta === undefined) {
        startBrightnessRef.current = undefined;
        setInteracting(false);
        return;
      }

      const { current: startBrightness } = startBrightnessRef;

      const brightness =
        startBrightness === undefined ? currentBrightness : startBrightness;

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
  brightness: number | undefined;
  loading: boolean | undefined;
  value: boolean | undefined;
}> = ({ brightness, loading, value }) => (
  <NonBreaking>
    {useMemo(() => {
      if (value === undefined || brightness === undefined) return '?';
      if (loading) return '…';

      return <TabularNums>{Math.round(brightness * 100)}%</TabularNums>;
    }, [brightness, loading, value])}
  </NonBreaking>
);

export const BrightnessActuator: FunctionComponent<{
  actuator: TBrightnessActuator;
  onClick?: () => void;
  title?: I18nKey;
}> = ({ actuator, onClick, title }) => {
  const value = useTypedEmitter(actuator.main).value;

  const brightness = useTypedEmitter(actuator.brightness).value;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const setBrightness = useTypedCollector(actuator.brightness);
  const brightnessRef = useRef(brightness);
  useEffect(() => {
    brightnessRef.current = brightness;
  }, [brightness]);

  const loading = useTypedEmitter(
    'actuatorStaleness' in actuator
      ? actuator.actuatorStaleness.loading
      : undefined,
  ).value;
  const loadingRef = useRef(loading);
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const flip = useTypedCollector(actuator.flip);
  const handleClick = useCallback(() => flip?.(null), [flip]);

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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const name = String(title ?? actuator.$path?.at(-1) ?? actuator.topic);

  const ColorBody = useColorBody(
    BodyLarge,
    String(actuator.$path?.at(-1) ?? ''),
    actuator.topic,
  );

  const allowTransition = Boolean(useDelay($rootPath.value, 300, true));

  const label = (
    <BrightnessLabel brightness={brightness} loading={loading} value={value} />
  );

  return (
    <Cell
      onClick={onClick ?? handleClick}
      title={<Translation i18nKey={name} capitalize={true} />}
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
