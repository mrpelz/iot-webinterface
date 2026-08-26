/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Match, TExclude } from '@iot/iot-monolith/tree';
import { FunctionComponent, MouseEventHandler } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

import { TSystem } from '../../../../common/types.js';
import { serialized } from '../../../api.js';
import { BlendOver } from '../../../components/blend-over.js';
import { BodyLarge } from '../../../components/controls.js';
import { Haptic } from '../../../components/haptic.js';
import { ForwardIcon } from '../../../components/icons.js';
import { TabularNums } from '../../../components/text.js';
import { useTypedCollector, useTypedEmitter } from '../../../hooks/use-api.js';
import { useColorBody } from '../../../hooks/use-color-body.js';
import { useDelay } from '../../../hooks/use-delay.js';
import { useShortenedPath } from '../../../hooks/use-path.js';
import {
  useDateFromEpoch,
  useTimeLabel,
  useTimeSpan,
} from '../../../hooks/use-time-label.js';
import { I18nKey } from '../../../i18n/main.js';
import { rootPath$, setSubPath } from '../../../state/path.js';
import { Translation } from '../../../views/translation.js';
import { Cell } from '../main.js';

// @ts-ignore
export type TOffTimer = Match<
  {
    $: 'offTimer';
  },
  TExclude,
  TSystem
>;

const TimerActuatorBody: FunctionComponent<{
  object: TOffTimer;
}> = ({ object }) => {
  const {
    active: {
      cancel: { main: cancel },
      main: active,
    },
    flip: { main: flip },
    main,
    runoutTime: { main: runoutTime },
    triggerTime: { main: triggerTime },
    // @ts-ignore
  } = object;

  const OverlayBody = useColorBody(BodyLarge, '');

  const { value: enabledValue } = useTypedEmitter(serialized(main));
  const { value: activeValue } = useTypedEmitter(serialized(active));

  const runoutTimeDate = useDateFromEpoch(
    useTypedEmitter(serialized(runoutTime)).value,
  );
  const triggerTimeDate = useDateFromEpoch(
    useTypedEmitter(serialized(triggerTime)).value,
  );

  const runoutTimeLabel = useTimeLabel(runoutTimeDate, 0);

  const [, fraction] = useTimeSpan(triggerTimeDate, runoutTimeDate);

  const handleFlip = useTypedCollector(serialized(flip));
  const handleCancel = useTypedCollector(serialized(cancel));

  const handleBodyClick = useCallback<MouseEventHandler<HTMLElement>>(
    (event) => {
      event.stopPropagation();

      if (activeValue) {
        handleCancel(null);
        return;
      }

      handleFlip(null);
    },
    [activeValue, handleCancel, handleFlip],
  );

  const allowTransition = Boolean(useDelay(rootPath$.value, 300, true));

  const label = useMemo(() => {
    if (!activeValue || !runoutTimeLabel) {
      return null;
    }

    return <TabularNums>{runoutTimeLabel}</TabularNums>;
  }, [activeValue, runoutTimeLabel]);

  const blendOver = useMemo(() => {
    if (activeValue && fraction !== null) return fraction;
    if (enabledValue) return 0;
    return 1;
  }, [activeValue, enabledValue, fraction]);

  const hasJustFinished =
    (useDelay(activeValue, 1000) && !activeValue) || (activeValue && !label);

  return (
    <BlendOver
      blendOver={blendOver}
      invert={true}
      transition={allowTransition && activeValue !== null}
      transitionDurationOverride={activeValue ? 1000 : 300}
      overlay={
        enabledValue === null ? undefined : (
          // eslint-disable-next-line react-hooks/static-components
          <OverlayBody>
            {label || <Translation i18nKey="on" />}
            <Haptic />
          </OverlayBody>
        )
      }
      onClick={handleBodyClick}
    >
      <BodyLarge>
        {hasJustFinished ? (
          <Translation i18nKey="finished" />
        ) : (
          label || <Translation i18nKey="off" />
        )}
        <Haptic />
      </BodyLarge>
    </BlendOver>
  );
};

export const TimerActuator: FunctionComponent<{
  object: TOffTimer;
  onClick?: () => void;
  title?: I18nKey;
}> = ({ object, onClick, title }) => {
  const {
    $id,
    $path,
    // @ts-ignore
  } = serialized(object);

  const name_ = useShortenedPath($path);
  const name = String(title ?? name_?.join(' ') ?? $path?.at(-1) ?? object.$);

  const handleHeaderClick = useCallback(() => {
    setSubPath($id);
  }, [$id]);

  return (
    <Cell
      icon={<ForwardIcon height="1em" />}
      title={
        <Translation
          capitalize={true}
          i18nKey={name}
        />
      }
      onClick={onClick ?? handleHeaderClick}
    >
      <TimerActuatorBody object={object} />
    </Cell>
  );
};
