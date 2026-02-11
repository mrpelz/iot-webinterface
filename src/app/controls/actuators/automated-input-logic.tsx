/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Match, TExclude } from '@iot/iot-monolith/tree';
import { FunctionComponent } from 'preact';
import { useCallback } from 'preact/hooks';

import { TSerialization } from '../../../common/types.js';
import { ForwardIcon } from '../../components/icons.js';
import { useTypedCollector, useTypedEmitter } from '../../hooks/use-api.js';
import { I18nKey } from '../../i18n/main.js';
import { setSubPath } from '../../state/path.js';
import { extractKey } from '../../util/oop.js';
import { Translation } from '../../views/translation.js';
import { Cell } from '../main.js';

// @ts-ignore
export type TAutomatedInputLogic = Match<
  {
    $: 'automatedInputLogic';
  },
  TExclude,
  TSerialization
>;

export const AutomatedInputLogic: FunctionComponent<{
  object: TAutomatedInputLogic;
  onClick?: () => void;
  title?: I18nKey;
}> = ({ object, onClick, title }) => {
  const {
    $id,
    $path,
    internal: { output },
    automationEnable,
    timerAutomation,
    timerOutput,
    // @ts-ignore
  } = object;

  const { value: automationEnableMain } = useTypedEmitter(
    automationEnable.main,
  );
  const { value: automationEnableManual } = useTypedEmitter(
    automationEnable.manual,
  );
  const setAtomationEnableManual = useTypedCollector(automationEnable.manual);
  const { value: automationEnableScheduled } = useTypedEmitter(
    extractKey(automationEnable, 'scheduled'),
  );
  const { value: automationEnablePermanent } = useTypedEmitter(
    automationEnable.permanent,
  );
  const setAtomationEnablePermanent = useTypedCollector(
    automationEnable.permanent,
  );

  const { value: timerOutputEnabled } = useTypedEmitter(timerOutput.main);
  const { value: timerOutputActive } = useTypedEmitter(timerOutput.active.main);

  // @ts-ignore
  const name = String(title ?? object.$path?.at(-1));

  const handleHeaderClick = useCallback(() => {
    setSubPath($id);
  }, [$id]);

  return (
    <Cell
      icon={<ForwardIcon height="1em" />}
      onClick={onClick ?? handleHeaderClick}
      title={<Translation i18nKey={name} capitalize={true} />}
    >
      <pre>
        {JSON.stringify(
          [
            automationEnableMain,
            automationEnableManual,
            automationEnablePermanent,
            automationEnableScheduled,
            timerOutputActive,
            timerOutputEnabled,
          ],
          null,
          2,
        )}
      </pre>
    </Cell>
  );
};
