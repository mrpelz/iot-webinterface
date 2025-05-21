import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { AlignRight, TabularNums } from '../../../components/text.js';
import { TOpenSensor } from '../../../controls/sensor/open.js';
import {
  useAbsoluteTimeLabel,
  useDateFromEpoch,
  useRelativeTimeLabel,
} from '../../../hooks/use-time-label.js';
import { useTypedEmitter } from '../../../state/api.js';
import { useTitleOverride } from '../../../state/title.js';
import { getTranslation } from '../../../state/translation.js';
import { Entry, List } from '../../../views/list.js';
import { Translation } from '../../../views/translation.js';

export const OpenSensor: FunctionComponent<{
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  sensor: TOpenSensor;
}> = ({ sensor }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { $ } = sensor;

  useTitleOverride(getTranslation($).value);

  const {
    open: {
      isReceivedValue,
      lastChange: { main: lastChange },
      main: open,
      tamperSwitch: {
        lastChange: { main: tamperSwitchLastChange },
        main: tamperSwitch,
      },
    },
  } = sensor;

  const openValue = useTypedEmitter(open).value;

  const openLastChangeDate = useDateFromEpoch(
    useTypedEmitter(lastChange).value,
  );
  const openLastChangeRelative = useRelativeTimeLabel(openLastChangeDate);
  const openLastChangeAbsolute = useAbsoluteTimeLabel(openLastChangeDate);

  const tamperSwitchValue = useTypedEmitter(tamperSwitch).value;
  const tamperSwitchLastChangeDate = useDateFromEpoch(
    useTypedEmitter(tamperSwitchLastChange).value,
  );
  const tamperSwitchLastChangeRelative = useRelativeTimeLabel(
    tamperSwitchLastChangeDate,
  );
  const tamperSwitchLastChangeAbsolute = useAbsoluteTimeLabel(
    tamperSwitchLastChangeDate,
  );

  const openIsReceived = useTypedEmitter(isReceivedValue).value;

  return (
    <>
      <List>
        <Entry label={<Translation i18nKey="state" capitalize={true} />}>
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
        <Entry label={<Translation i18nKey="tamperSwitch" capitalize={true} />}>
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
