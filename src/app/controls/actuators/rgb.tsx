// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Match, TExclude } from '@iot/iot-monolith/tree';
import { StyledVNode } from 'goober';
import { FunctionComponent } from 'preact';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';

import { TSerialization } from '../../../common/types.js';
import { BlendOver } from '../../components/blend-over.js';
import { ColorIcon } from '../../components/icons.js';
import {
  BodyDisableRoundedCorners,
  ColorLabel,
  RGBBody,
} from '../../components/rgb-actuator.js';
import { useColorBody } from '../../hooks/use-color-body.js';
import { useColorPicker } from '../../hooks/use-color-picker.js';
import { useDelay } from '../../hooks/use-delay.js';
import { useSwipe } from '../../hooks/use-swipe.js';
import { useWheel } from '../../hooks/use-wheel.js';
import { I18nKey } from '../../i18n/main.js';
import { useTypedCollector, useTypedEmitter } from '../../state/api.js';
import { $rootPath } from '../../state/path.js';
import { Translation } from '../../views/translation.js';
import { Cell } from '../main.js';
import {
  BrightnessLabel,
  TBrightnessActuator,
  useSwipeBrightness,
  useWheelBrightness,
} from './brightness.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type TRGBActuator = Match<
  {
    $: 'rgb';
  },
  TExclude,
  TSerialization
>;

const Color: FunctionComponent<{
  actuator: TBrightnessActuator;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  base?: StyledVNode<any>;
}> = ({
  actuator,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  base: Base = RGBBody,
}) => {
  const value = useTypedEmitter(actuator.main).value;

  const brightness = useTypedEmitter(actuator.brightness).value;
  const setBrightness = useTypedCollector(actuator.brightness);
  const brightnessRef = useRef(brightness);
  useEffect(() => {
    brightnessRef.current = brightness;
  }, [brightness]);

  const loading = useTypedEmitter(actuator.actuatorStaleness.loading).value;
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

  const ColorBody = useColorBody(
    Base,
    String(actuator.$path.at(-1) ?? ''),
    actuator.topic,
  );

  const allowTransition = Boolean(useDelay($rootPath.value, 300, true));

  const label = useMemo(
    () => (
      <>
        <ColorLabel>
          <Translation i18nKey={actuator.topic} />
        </ColorLabel>
        <BrightnessLabel
          brightness={brightness}
          loading={loading}
          value={value}
        />
      </>
    ),
    [actuator.topic, brightness, loading, value],
  );

  return (
    <BlendOver
      blendOver={brightness === undefined ? 0 : brightness}
      transition={
        allowTransition &&
        brightness !== undefined &&
        !loading &&
        !isInteracting
      }
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
  actuator: TRGBActuator;
  onClick?: () => void;
  title?: I18nKey;
}> = ({ actuator, onClick, title }) => {
  return null;

  const rBrightness = useTypedEmitter(actuator.r.brightness).value;
  const rSetBrightness = useTypedCollector(actuator.r.brightness);

  const gBrightness = useTypedEmitter(actuator.g.brightness).value;
  const gSetBrightness = useTypedCollector(actuator.g.brightness);

  const bBrightness = useTypedEmitter(actuator.b.brightness).value;
  const bSetBrightness = useTypedCollector(actuator.b.brightness);

  const [focus, colorPicker] = useColorPicker(
    useMemo(() => [rBrightness, rSetBrightness], [rBrightness, rSetBrightness]),
    useMemo(() => [gBrightness, gSetBrightness], [gBrightness, gSetBrightness]),
    useMemo(() => [bBrightness, bSetBrightness], [bBrightness, bSetBrightness]),
  );

  return (
    <Cell
      icon={<ColorIcon height="1em" />}
      onClick={onClick || focus}
      title={
        <>
          {colorPicker}
          <Translation i18nKey={title || 'lighting'} capitalize={true} />
        </>
      }
    >
      <Color base={BodyDisableRoundedCorners} actuator={actuator.r} />
      <Color base={BodyDisableRoundedCorners} actuator={actuator.g} />
      <Color actuator={actuator.b} />
    </Cell>
  );
};
