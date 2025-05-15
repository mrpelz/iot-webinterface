import { Match, TExclude } from '@iot/iot-monolith/tree';
import { FunctionComponent } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

import { TSerialization } from '../../../common/types.js';
import { BlendOver } from '../../components/blend-over.js';
import { BodyLarge } from '../../components/controls.js';
import { TabularNums } from '../../components/text.js';
import { useColorBody } from '../../hooks/use-color-body.js';
import { useDelay } from '../../hooks/use-delay.js';
import {
  useDateFromEpoch,
  useTimeLabel,
  useTimeSpan,
} from '../../hooks/use-time-label.js';
import { I18nKey } from '../../i18n/main.js';
import { useTypedCollector, useTypedEmitter } from '../../state/api.js';
import { $rootPath } from '../../state/path.js';
import { Translation } from '../../views/translation.js';
import { Cell } from '../main.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type TOffTimer = Match<
  {
    $: 'offTimer';
  },
  TExclude,
  TSerialization
>;

export const TimerActuator: FunctionComponent<{
  object: TOffTimer;
  onClick?: () => void;
  title?: I18nKey;
}> = ({ object, onClick, title }) => {
  const {
    $path,
    active: {
      cancel: { main: cancel },
      main: active,
    },
    flip: { main: flip },
    main,
    runoutTime: { main: runoutTime },
    triggerTime: { main: triggerTime },
  } = object;

  const { value: enabledValue } = useTypedEmitter(main);
  const { value: activeValue } = useTypedEmitter(active);

  const runoutTimeDate = useDateFromEpoch(useTypedEmitter(runoutTime).value);
  const triggerTimeDate = useDateFromEpoch(useTypedEmitter(triggerTime).value);

  const runoutTimeLabel = useTimeLabel(runoutTimeDate, 0);

  const [, fraction] = useTimeSpan(triggerTimeDate, runoutTimeDate);

  const handleFlip = useTypedCollector(flip);
  const handleCancel = useTypedCollector(cancel);

  const handleClick = useCallback(() => {
    if (activeValue) {
      handleCancel(null);
      return;
    }

    handleFlip(null);
  }, [activeValue, handleCancel, handleFlip]);

  const ColorBody = useColorBody(BodyLarge, String($path?.at(-1)));

  const allowTransition = Boolean(useDelay($rootPath.value, 300, true));

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
    <Cell
      onClick={flip && !onClick ? handleClick : onClick}
      title={<Translation i18nKey={title} capitalize={true} />}
    >
      <BlendOver
        blendOver={blendOver}
        invert={true}
        transition={allowTransition && activeValue !== null}
        transitionDurationOverride={activeValue ? 1000 : 300}
        overlay={
          enabledValue === null ? undefined : (
            <ColorBody>{label || <Translation i18nKey="on" />}</ColorBody>
          )
        }
      >
        <BodyLarge>
          {hasJustFinished ? (
            <Translation i18nKey="finished" />
          ) : (
            label || <Translation i18nKey="off" />
          )}
        </BodyLarge>
      </BlendOver>
    </Cell>
  );
};
