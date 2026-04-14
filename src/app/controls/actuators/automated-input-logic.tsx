/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Match, TExclude } from '@iot/iot-monolith/tree';
import { FunctionComponent, MouseEventHandler } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

import { TSystem } from '../../../common/types.js';
import { serialized } from '../../api.js';
import {
  BlendOver,
  BlendOverContent,
  BlendOverWrapper,
} from '../../components/blend-over.js';
import { BodyBottomBand, BodyLarge } from '../../components/controls.js';
import { ForwardIcon } from '../../components/icons.js';
import { TabularNums } from '../../components/text.js';
import { useTypedCollector, useTypedEmitter } from '../../hooks/use-api.js';
import { useColorBody } from '../../hooks/use-color-body.js';
import { useDelay } from '../../hooks/use-delay.js';
import { useExtractKey } from '../../hooks/use-ensure-keys.js';
import {
  useDateFromEpoch,
  useTimeLabel,
  useTimeSpan,
} from '../../hooks/use-time-label.js';
import { I18nKey } from '../../i18n/main.js';
import { $rootPath, setSubPath } from '../../state/path.js';
import { Translation } from '../../views/translation.js';
import { Cell } from '../main.js';

// @ts-ignore
export type TAutomatedInputLogic = Match<
  {
    $: 'automatedInputLogic';
  },
  TExclude,
  TSystem
>;

export const TimerOutputBody: FunctionComponent<{
  object: TAutomatedInputLogic;
}> = ({ object }) => {
  const {
    automationEnable: {
      main: automationEnable,
      manual: automationEnableManual,
    },
    timerOutput: {
      active: {
        cancel: { main: cancel },
        main: active,
      },
      flip: { main: flip },
      runoutTime: { main: runoutTime },
      triggerTime: { main: triggerTime },
      // @ts-ignore
    },
    // @ts-ignore
  } = object;

  const OverlayBody = useColorBody(BodyLarge, '');

  const { value: enabledValue } = useTypedEmitter(serialized(automationEnable));
  const { value: enabledManualValue } = useTypedEmitter(
    serialized(automationEnableManual),
  );

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

  const allowTransition = Boolean(useDelay($rootPath.value, 300, true));

  const label = useMemo(() => {
    if (!activeValue || !runoutTimeLabel) {
      return null;
    }

    return <TabularNums>{runoutTimeLabel}</TabularNums>;
  }, [activeValue, runoutTimeLabel]);

  const blendOver = useMemo(() => {
    if (activeValue && fraction !== undefined) return fraction;
    if (!enabledValue) return 0;
    return 1;
  }, [activeValue, enabledValue, fraction]);

  const hasJustFinished =
    (useDelay(activeValue, 1000) && !activeValue) || (activeValue && !label);

  // console.log(enabledValue, blendOver);

  return (
    <BlendOver
      blendOver={blendOver}
      invert={true}
      onClick={handleBodyClick}
      transition={allowTransition && activeValue !== undefined}
      transitionDurationOverride={activeValue ? 1000 : 300}
      overlay={
        enabledValue ? (
          // eslint-disable-next-line react-hooks/static-components
          <OverlayBody>
            {label || <Translation i18nKey="enabled" />}
          </OverlayBody>
        ) : undefined
      }
    >
      <BodyLarge>
        {hasJustFinished ? (
          <Translation i18nKey="finished" />
        ) : (
          label || (
            <Translation
              i18nKey={enabledManualValue ? 'disabled' : 'inhibited'}
            />
          )
        )}
      </BodyLarge>
    </BlendOver>
  );
};

export const AutomatedInputLogic: FunctionComponent<{
  object: TAutomatedInputLogic;
  onClick?: () => void;
  title?: I18nKey;
}> = ({ object, onClick, title }) => {
  const {
    $id,
    $path,
    automationEnable: {
      main: automationEnableMain,
      manual: automationEnableManual,
      permanent: automationEnablePermanent,
    },
    automationEnable,
    timerAutomation: {
      active: { main: timerAutomationActive },
      runoutTime: { main: timerAutomationRunoutTime },
      triggerTime: { main: timerAutomationTriggerTime },
    },
    timerOutput: {
      active: {
        main: timerOutputActive,
        cancel: { main: timerOutputCancel },
      },
      runoutTime: { main: timerOutputRunoutTime },
      triggerTime: { main: timerOutputTriggerTime },
    },
    // @ts-ignore
  } = serialized(object);

  const automationEnableScheduled = useExtractKey(
    automationEnable,
    'scheduled',
  );

  // @ts-ignore
  const name = String(title ?? $path?.at(-1));

  const { value: isAutomationEnabledMain } = useTypedEmitter(
    serialized(automationEnableMain),
  );

  const { value: isTimerOutputActive } = useTypedEmitter(
    serialized(timerOutputActive),
  );
  const timerOutputRunoutTimeDate = useDateFromEpoch(
    useTypedEmitter(serialized(timerOutputRunoutTime)).value,
  );
  const timerOutputRunoutTimeLabel = useTimeLabel(timerOutputRunoutTimeDate, 0);
  const [, timerOutputFraction] = useTimeSpan(
    useDateFromEpoch(useTypedEmitter(serialized(timerOutputTriggerTime)).value),
    timerOutputRunoutTimeDate,
  );
  const cancelTimerOutput = useTypedCollector(serialized(timerOutputCancel));

  const { value: isAutomationEnabledPermanent } = useTypedEmitter(
    serialized(automationEnablePermanent),
  );
  const setAutomationEnablePermanent = useTypedCollector(
    serialized(automationEnablePermanent),
  );

  const { value: isAutomationEnabledScheduled } = useTypedEmitter(
    serialized(automationEnableScheduled),
  );

  const { value: isAutomationEnabledManual } = useTypedEmitter(
    serialized(automationEnableManual),
  );
  const setAutomationEnableManual = useTypedCollector(
    serialized(automationEnableManual),
  );

  const { value: isTimerAutomationActive } = useTypedEmitter(
    serialized(timerAutomationActive),
  );
  const timerAutomationRunoutTimeDate = useDateFromEpoch(
    useTypedEmitter(serialized(timerAutomationRunoutTime)).value,
  );
  const timerAutomationRunoutTimeLabel = useTimeLabel(
    timerAutomationRunoutTimeDate,
    0,
  );
  const [, timerAutomationFraction] = useTimeSpan(
    useDateFromEpoch(
      useTypedEmitter(serialized(timerAutomationTriggerTime)).value,
    ),
    timerAutomationRunoutTimeDate,
  );

  const labelPrimary = useMemo(() => {
    if (isAutomationEnabledMain) {
      if (isTimerOutputActive) {
        return <Translation i18nKey="turning off…" />;
      }

      return <Translation i18nKey="enabled" />;
    }

    if (
      !isAutomationEnabledPermanent ||
      isAutomationEnabledScheduled === false
    ) {
      return <Translation i18nKey="disabled" />;
    }

    if (!isAutomationEnabledManual) {
      if (isTimerAutomationActive) {
        return <Translation i18nKey="inhibited" />;
      }

      return <Translation i18nKey="disabled" />;
    }

    return null;
  }, [
    isAutomationEnabledMain,
    isAutomationEnabledManual,
    isAutomationEnabledPermanent,
    isAutomationEnabledScheduled,
    isTimerAutomationActive,
    isTimerOutputActive,
  ]);

  const labelSecondary = useMemo(() => {
    if (isAutomationEnabledMain) {
      if (isTimerOutputActive) {
        return timerOutputRunoutTimeLabel;
      }

      return null;
    }

    if (!isAutomationEnabledPermanent) {
      return <Translation i18nKey="permanent" />;
    }

    if (isAutomationEnabledScheduled === false) {
      return <Translation i18nKey="scheduled" />;
    }

    if (!isAutomationEnabledManual && isTimerAutomationActive) {
      return (
        <>
          <Translation i18nKey="reenabling" /> {timerAutomationRunoutTimeLabel}
        </>
      );
    }

    return null;
  }, [
    isAutomationEnabledMain,
    isAutomationEnabledManual,
    isAutomationEnabledPermanent,
    isAutomationEnabledScheduled,
    isTimerAutomationActive,
    isTimerOutputActive,
    timerAutomationRunoutTimeLabel,
    timerOutputRunoutTimeLabel,
  ]);

  const handleHeaderClick = useCallback(() => {
    setSubPath($id);
  }, [$id]);

  const handleBodyClick = useCallback<MouseEventHandler<HTMLElement>>(
    (event) => {
      event.stopPropagation();

      if (isAutomationEnabledMain) {
        if (isTimerOutputActive) {
          cancelTimerOutput(null);
          return;
        }

        setAutomationEnablePermanent(false);
        return;
      }

      if (isAutomationEnabledManual) {
        setAutomationEnablePermanent(!isAutomationEnabledPermanent);
        return;
      }

      setAutomationEnableManual(true);
    },
    [
      cancelTimerOutput,
      isAutomationEnabledMain,
      isAutomationEnabledManual,
      isAutomationEnabledPermanent,
      isTimerOutputActive,
      setAutomationEnableManual,
      setAutomationEnablePermanent,
    ],
  );

  return (
    <Cell
      icon={<ForwardIcon height="1em" />}
      onClick={handleHeaderClick ?? onClick}
      title={<Translation i18nKey={name} capitalize />}
    >
      <BlendOverWrapper>
        <BlendOverContent>
          <BodyLarge onClick={handleBodyClick}>{labelPrimary}</BodyLarge>
        </BlendOverContent>
        <BlendOverContent>
          <BodyBottomBand>{labelSecondary}</BodyBottomBand>
        </BlendOverContent>
      </BlendOverWrapper>
    </Cell>
  );
};
