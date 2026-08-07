import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { serialized } from '../../../api.js';
import { AlignRight, TabularNums } from '../../../components/text.js';
import { TOpenSensor } from '../../../controls/sensor/open.js';
import { useTypedEmitter } from '../../../hooks/use-api.js';
import {
  useAbsoluteTimeLabel,
  useDateFromEpoch,
  useRelativeTimeLabel,
} from '../../../hooks/use-time-label.js';
import { useTitleOverride } from '../../../state/title.js';
import { getTranslationFallback } from '../../../state/translation.js';
import { Entry, List } from '../../../views/list.js';
import { Translation } from '../../../views/translation.js';

export const OpenSensor: FunctionComponent<{
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  sensor: TOpenSensor;
}> = ({ sensor }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const name = useMemo(() => String(sensor.$path?.at(-1) ?? ''), [sensor]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { $ } = sensor;

  useTitleOverride(getTranslationFallback(name ?? $).value);

  const {
    open: {
      isReceivedValue: { main: isReceivedValue },
      lastChange: { main: lastChange },
      main: open,
      tamperSwitch: {
        lastChange: { main: tamperSwitchLastChange },
        main: tamperSwitch,
      },
    },
  } = sensor;

  const openValue = useTypedEmitter(serialized(open)).value;

  const openLastChangeDate = useDateFromEpoch(
    useTypedEmitter(serialized(lastChange)).value,
  );
  const openLastChangeRelative = useRelativeTimeLabel(openLastChangeDate);
  const openLastChangeAbsolute = useAbsoluteTimeLabel(openLastChangeDate);

  const tamperSwitchValue = useTypedEmitter(serialized(tamperSwitch)).value;
  const tamperSwitchLastChangeDate = useDateFromEpoch(
    useTypedEmitter(serialized(tamperSwitchLastChange)).value,
  );
  const tamperSwitchLastChangeRelative = useRelativeTimeLabel(
    tamperSwitchLastChangeDate,
  );
  const tamperSwitchLastChangeAbsolute = useAbsoluteTimeLabel(
    tamperSwitchLastChangeDate,
  );

  const openIsReceived = useTypedEmitter(serialized(isReceivedValue)).value;

  return (
    <>
      <List>
        <Entry
          label={
            <Translation
              capitalize={true}
              i18nKey="state"
            />
          }
        >
          {useMemo(() => {
            if (openValue === undefined) {
              return <Translation i18nKey="unknown" />;
            }

            if (openValue) {
              return <Translation i18nKey="open" />;
            }

            return <Translation i18nKey="closed" />;
          }, [openValue])}
        </Entry>
        <Entry
          label={
            <>
              {'\u2003'}
              <Translation i18nKey="lastChange" />
            </>
          }
        >
          {openLastChangeDate ? (
            <AlignRight>
              <TabularNums>
                {openLastChangeAbsolute} <br />({openLastChangeRelative})
              </TabularNums>
            </AlignRight>
          ) : (
            '—'
          )}
        </Entry>
      </List>
      <List>
        <Entry
          label={
            <Translation
              capitalize={true}
              i18nKey="tamperSwitch"
            />
          }
        >
          {useMemo(
            () =>
              tamperSwitchValue ? <Translation i18nKey="triggered" /> : '—',
            [tamperSwitchValue],
          )}
        </Entry>
        <Entry
          label={
            <>
              {'\u2003'}
              <Translation i18nKey="lastChange" />
            </>
          }
        >
          {tamperSwitchLastChangeDate ? (
            <AlignRight>
              <TabularNums>
                {tamperSwitchLastChangeAbsolute} <br />(
                {tamperSwitchLastChangeRelative})
              </TabularNums>
            </AlignRight>
          ) : (
            '—'
          )}
        </Entry>
      </List>
      <List>
        <Entry label={<Translation i18nKey="restored" />}>
          {useMemo(
            () =>
              openIsReceived ? (
                <Translation i18nKey="no" />
              ) : (
                <Translation i18nKey="yes" />
              ),
            [openIsReceived],
          )}
        </Entry>
      </List>
    </>
  );
};
