import { epochs } from '@mrpelz/modifiable-date';
import { FunctionComponent, GenericEventHandler, TargetedEvent } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

import { Entry as EntryComponent } from '../../../components/list.js';
import { NonBreaking } from '../../../components/text.js';
import { NullActuatorButton } from '../../../controls/actuators/null.js';
import { TOffTimer } from '../../../controls/actuators/off-timer.js';
import { useTypedCollector, useTypedEmitter } from '../../../hooks/use-api.js';
import {
  useDateFromEpoch,
  useTimeLabel,
} from '../../../hooks/use-time-label.js';
import { useTitleOverride } from '../../../state/title.js';
import { getTranslationFallback } from '../../../state/translation.js';
import { Entry, List } from '../../../views/list.js';
import { Translation } from '../../../views/translation.js';

export const OffTimer: FunctionComponent<{
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  actuator: TOffTimer;
}> = ({ actuator }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const name = useMemo(() => String(actuator.$path?.at(-1) ?? ''), [actuator]);

  useTitleOverride(getTranslationFallback(name).value);

  const {
    active: { cancel, main: active },
    flip,
    main,
    runoutTime: { main: runoutTime },
    time: {
      initialTime,
      isChanged: { main: isChanged },
      main: time,
      reset,
    },
    triggerTime: { main: triggerTime },
  } = actuator;

  const { value: enabledValue } = useTypedEmitter(main);
  const { value: activeValue } = useTypedEmitter(active);
  const { value: isChangedValue } = useTypedEmitter(isChanged);
  const { value: timeValue } = useTypedEmitter(time);

  const setTime = useTypedCollector(time);

  const triggerTimeDate = useDateFromEpoch(
    useTypedEmitter(triggerTime).value ?? undefined,
  );
  const runoutTimeDate = useDateFromEpoch(
    useTypedEmitter(runoutTime).value ?? undefined,
  );

  const triggerTimeLabel = useTimeLabel(triggerTimeDate, 0);
  const runoutTimeLabel = useTimeLabel(runoutTimeDate, 0);

  return (
    <>
      <List>
        <Entry label={<Translation i18nKey="enabled" capitalize={true} />}>
          <Translation i18nKey={enabledValue ? 'true' : 'false'} />
        </Entry>
        <Entry label={<Translation i18nKey="active" capitalize={true} />}>
          <Translation i18nKey={activeValue ? 'true' : 'false'} />
        </Entry>
        <Entry label={<Translation i18nKey="triggerTime" capitalize={true} />}>
          {triggerTimeLabel ?? '—'}
        </Entry>
        <Entry label={<Translation i18nKey="runoutTime" capitalize={true} />}>
          {runoutTimeLabel ?? '—'}
        </Entry>
        <Entry label={<Translation i18nKey="initialTime" capitalize={true} />}>
          <NonBreaking>
            {useMemo(() => initialTime / epochs.minute, [initialTime])}{' '}
            <Translation i18nKey="minutes" />
          </NonBreaking>
        </Entry>
        <Entry label={<Translation i18nKey="setTime" capitalize={true} />}>
          <NonBreaking>
            {useMemo(() => (timeValue ?? 0) / epochs.minute, [timeValue])}{' '}
            <Translation i18nKey="minutes" />
          </NonBreaking>
        </Entry>
        <Entry label={<Translation i18nKey="isChanged" capitalize={true} />}>
          <Translation i18nKey={isChangedValue ? 'true' : 'false'} />
        </Entry>
        <EntryComponent>
          <NullActuatorButton actuator={flip}>
            {enabledValue ? 'disable' : 'enable'} timer
          </NullActuatorButton>
        </EntryComponent>
        <EntryComponent>
          <NullActuatorButton actuator={cancel} disabled={!activeValue}>
            cancel timer
          </NullActuatorButton>
        </EntryComponent>
        <Entry
          label={<Translation capitalize={true} i18nKey="override time" />}
        >
          <div>
            <input
              id="overrideTime"
              inputMode="numeric"
              min="1"
              name="overrideTime"
              pattern="[0-9]*"
              placeholder="0"
              value=""
              onBlur={useCallback<GenericEventHandler<HTMLInputElement>>(
                ({
                  currentTarget: { value },
                }: TargetedEvent<HTMLInputElement, Event>) => {
                  const input = Number.parseInt(value.trim(), 10);
                  if (
                    !input ||
                    input < 1 ||
                    Number.isNaN(input) ||
                    !Number.isInteger(input)
                  ) {
                    return;
                  }

                  const override = input * epochs.minute;
                  if (override === timeValue) return;

                  setTime(override);
                },
                [setTime, timeValue],
              )}
            />
            <i> m</i>
          </div>
        </Entry>
        <EntryComponent>
          <NullActuatorButton actuator={reset} disabled={!isChangedValue}>
            reset time
          </NullActuatorButton>
        </EntryComponent>
      </List>
    </>
  );
};
