/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Match, TExclude } from '@iot/iot-monolith/tree';
import { FunctionComponent, MouseEventHandler } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

import { TSystem } from '../../../common/types.js';
import { serialized } from '../../api.js';
import { BodyBottomBand, BodyLarge } from '../../components/controls.js';
import { ForwardIcon } from '../../components/icons.js';
import { TabularNums } from '../../components/text.js';
import { useTypedCollector, useTypedEmitter } from '../../hooks/use-api.js';
import { useColorBody } from '../../hooks/use-color-body.js';
import { useExtractKey } from '../../hooks/use-ensure-keys.js';
import { useDateFromEpoch, useTimeLabel } from '../../hooks/use-time-label.js';
import { I18nKey } from '../../i18n/main.js';
import { setSubPath } from '../../state/path.js';
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

export const AutomatedInputLogic: FunctionComponent<{
  object: TAutomatedInputLogic;
  onClick?: () => void;
  title?: I18nKey;
}> = ({ object, title }) => {
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
      // triggerTime: { main: timerAutomationTriggerTime },
    },
    timerOutput: {
      active: {
        main: timerOutputActive,
        cancel: { main: timerOutputCancel },
      },
      runoutTime: { main: timerOutputRunoutTime },
      // triggerTime: { main: timerOutputTriggerTime },
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
  // const [, timerOutputFraction] = useTimeSpan(
  //   useDateFromEpoch(useTypedEmitter(serialized(timerOutputTriggerTime)).value),
  //   timerOutputRunoutTimeDate,
  // );
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
  // const [, timerAutomationFraction] = useTimeSpan(
  //   useDateFromEpoch(
  //     useTypedEmitter(serialized(timerAutomationTriggerTime)).value,
  //   ),
  //   timerAutomationRunoutTimeDate,
  // );

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

      if (isTimerOutputActive) {
        cancelTimerOutput(null);
        return;
      }

      setAutomationEnablePermanent(!isAutomationEnabledPermanent);
    },
    [
      cancelTimerOutput,
      isAutomationEnabledPermanent,
      isTimerOutputActive,
      setAutomationEnablePermanent,
    ],
  );

  const OverlayBody = useColorBody(
    BodyLarge,
    isAutomationEnabledMain ? '' : undefined,
  );

  return (
    <Cell
      icon={<ForwardIcon height="1em" />}
      onClick={handleHeaderClick}
      title={<Translation i18nKey={name} capitalize />}
    >
      {/* eslint-disable-next-line react-hooks/static-components*/}
      <OverlayBody onClick={handleBodyClick} borderRadius={!labelSecondary}>
        {labelPrimary}
      </OverlayBody>
      {labelSecondary ? (
        <BodyBottomBand>
          <TabularNums>{labelSecondary}</TabularNums>
        </BodyBottomBand>
      ) : null}
    </Cell>
  );
};
