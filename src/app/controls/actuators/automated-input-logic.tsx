/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Match, TExclude } from '@iot/iot-monolith/tree';
import { FunctionComponent, MouseEventHandler } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

import { TSerialization } from '../../../common/types.js';
import { Tag, TagGroup } from '../../components/controls.js';
import { TabularNums } from '../../components/text.js';
import { useTypedCollector, useTypedEmitter } from '../../hooks/use-api.js';
import { useDateFromEpoch, useTimeLabel } from '../../hooks/use-time-label.js';
import { I18nKey } from '../../i18n/main.js';
import { Translation } from '../../views/translation.js';
import { CellWithBody } from '../main.js';
import { TOffTimer } from './off-timer.js';

// @ts-ignore
export type TAutomatedInputLogic = Match<
  {
    $: 'automatedInputLogic';
  },
  TExclude,
  TSerialization
>;

const TimerTag: FunctionComponent<{ object: TOffTimer }> = ({
  object: {
    $path,
    active: {
      cancel: { main: cancel },
      main: active,
    },
    flip: { main: flip },
    main,
    runoutTime: { main: runoutTime },
    // @ts-ignore
  },
}) => {
  const { value: enabledValue } = useTypedEmitter(main);
  const { value: activeValue } = useTypedEmitter(active);

  const runoutTimeDate = useDateFromEpoch(useTypedEmitter(runoutTime).value);
  const runoutTimeLabel = useTimeLabel(runoutTimeDate, 0, { style: 'narrow' });

  // @ts-ignore
  const name = String($path?.at(-1));

  const handleFlip = useTypedCollector(flip);
  const handleCancel = useTypedCollector(cancel);

  const handleClick = useCallback<MouseEventHandler<HTMLElement>>(
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

  const label = useMemo(() => {
    if (!activeValue || !runoutTimeLabel) {
      return null;
    }

    return <TabularNums>{runoutTimeLabel}</TabularNums>;
  }, [activeValue, runoutTimeLabel]);

  return (
    <Tag onClick={handleClick} invert={activeValue} grow>
      <TagGroup>
        <Translation i18nKey={name} capitalize />
      </TagGroup>
      <TagGroup>
        {label || (
          <Translation i18nKey={enabledValue ? 'enabled' : 'disabled'} />
        )}
      </TagGroup>
    </Tag>
  );
};

export const AutomatedInputLogic: FunctionComponent<{
  object: TAutomatedInputLogic;
  onClick?: () => void;
  title?: I18nKey;
}> = ({ object, onClick, title }) => {
  const {
    // $id,
    $path,
    internal: {
      output: { main: output, flip },
    },
    automationEnable: {
      main: automationEnable,
      manual: automationEnableManual,
    },
    timerAutomation,
    timerOutput,
    // @ts-ignore
  } = object;

  // @ts-ignore
  const name = String(title ?? $path?.at(-1));

  const triggerOutputFlip = useTypedCollector(flip);
  const { value: outputValue } = useTypedEmitter(output);

  const { value: automationEnableValue } = useTypedEmitter(automationEnable);
  const setAutomationEnableManual = useTypedCollector(automationEnableManual);

  const handleOutputClick = useCallback(() => {
    triggerOutputFlip(null);
  }, [triggerOutputFlip]);

  const handleAutomationEnableClick = useCallback(() => {
    setAutomationEnableManual(!automationEnableValue);
  }, [automationEnableValue, setAutomationEnableManual]);

  // const handleHeaderClick = useCallback(() => {
  //   setSubPath($id);
  // }, [$id]);

  return (
    <CellWithBody
      // icon={<ForwardIcon height="1em" />}
      onClick={onClick}
      title={<Translation i18nKey={name} capitalize />}
      span={3}
    >
      <Tag onClick={handleOutputClick} invert={outputValue} grow>
        <TagGroup>
          <Translation i18nKey="output" capitalize />
        </TagGroup>
        <TagGroup>
          <Translation i18nKey={outputValue ? 'on' : 'off'} />
        </TagGroup>
      </Tag>
      <TimerTag object={timerOutput} />
      <Tag
        onClick={handleAutomationEnableClick}
        invert={automationEnableValue}
        grow
      >
        <TagGroup>
          <Translation i18nKey="automation" capitalize />
        </TagGroup>
        <TagGroup>
          <Translation i18nKey={automationEnableValue ? 'on' : 'off'} />
        </TagGroup>
      </Tag>
      <TimerTag object={timerAutomation} />
    </CellWithBody>
  );
};
