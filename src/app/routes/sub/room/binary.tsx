import { ensureKeys } from '@mrpelz/misc-utils/oop';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { serialized } from '../../../api.js';
import { AlignRight, TabularNums } from '../../../components/text.js';
import { TBinarySensor } from '../../../controls/sensor/binary.js';
import { THMMDMotionSensor } from '../../../controls/sensor/hmmd-motion.js';
import { useTypedEmitter } from '../../../hooks/use-api.js';
import {
  useAbsoluteTimeLabel,
  useDateFromEpoch,
  useRelativeTimeLabel,
} from '../../../hooks/use-time-label.js';
import {
  noBackground,
  useBackgroundOverride,
} from '../../../state/background.js';
import { useTitleOverride } from '../../../state/title.js';
import { getTranslationFallback } from '../../../state/translation.js';
import { Entry, List } from '../../../views/list.js';
import { Translation } from '../../../views/translation.js';

export const BinarySensor: FunctionComponent<{
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  sensor: TBinarySensor | THMMDMotionSensor;
}> = ({ sensor }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const name = useMemo(() => String(sensor.$path?.at(-1) ?? ''), [sensor]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { $ } = sensor;

  useTitleOverride(getTranslationFallback(name ?? $).value);
  useBackgroundOverride(noBackground);

  const {
    lastChange: { main: lastChange },
    lastSeen: { main: lastSeen },
    main,
  } = sensor;

  const { distance: { main: distance } = {} } = ensureKeys(sensor, 'distance');

  const value = useTypedEmitter(serialized(main)).value;
  const distanceValue = useTypedEmitter(serialized(distance)).value;

  const openLastChangeDate = useDateFromEpoch(
    useTypedEmitter(serialized(lastChange)).value,
  );
  const openLastChangeRelative = useRelativeTimeLabel(openLastChangeDate);
  const openLastChangeAbsolute = useAbsoluteTimeLabel(openLastChangeDate);

  const openLastSeenDate = useDateFromEpoch(
    useTypedEmitter(serialized(lastSeen)).value,
  );
  const openLastSeenRelative = useRelativeTimeLabel(openLastSeenDate);
  const openLastSeenAbsolute = useAbsoluteTimeLabel(openLastSeenDate);

  return (
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
          if (value === undefined) {
            return <Translation i18nKey="unknown" />;
          }

          if (value) {
            return <Translation i18nKey="yes" />;
          }

          return <Translation i18nKey="no" />;
        }, [value])}
      </Entry>
      {distance ? (
        <Entry
          label={
            <>
              {'\u2003'}
              <Translation i18nKey="distance" />
            </>
          }
        >
          <AlignRight>
            <TabularNums>{distanceValue}</TabularNums>
          </AlignRight>
        </Entry>
      ) : null}
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
      <Entry
        label={
          <>
            {'\u2003'}
            <Translation i18nKey="lastSeen" />
          </>
        }
      >
        {openLastSeenDate ? (
          <AlignRight>
            <TabularNums>
              {openLastSeenAbsolute} <br />({openLastSeenRelative})
            </TabularNums>
          </AlignRight>
        ) : (
          '—'
        )}
      </Entry>
    </List>
  );
};
