/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Level, Match, TExclude } from '@iot/iot-monolith/tree';
import { ensureKeys } from '@mrpelz/misc-utils/oop';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { LevelObject, serialized } from '../../api.js';
import { Tag, TagGroup } from '../../components/controls.js';
import {
  ActivityIcon,
  CheckIcon,
  ForwardIcon,
  XIcon,
} from '../../components/icons.js';
import { TabularNums } from '../../components/text.js';
import { useTypedEmitter } from '../../hooks/use-api.js';
import { useTimeLabel } from '../../hooks/use-time-label.js';
import { theme$ } from '../../state/theme.js';
import { CellWithBody } from './main.js';

// @ts-ignore
export type TDevice = LevelObject[Level.DEVICE];
export type TMainDevice = Match<{ isSubDevice: false }, TExclude, TDevice>;
export type TSubDevice = Match<{ isSubDevice: true }, TExclude, TDevice>;

export const OnlineIcon: FunctionComponent = () => (
  <CheckIcon
    color={theme$.value === 'highContrast' ? undefined : 'rgb(4, 195, 6)'}
    height="1em"
  />
);

export const OfflineIcon: FunctionComponent = () => (
  <XIcon
    color={theme$.value === 'highContrast' ? undefined : 'rgb(205, 3, 4)'}
    height="1em"
  />
);

const DeviceOnlineState: FunctionComponent<{
  device: TDevice | TSubDevice;
}> = ({ device }) => {
  const {
    online: { lastChange: { main: lastChange } = {}, main: online } = {},
    // @ts-ignore
  } = ensureKeys(device, 'online');

  const { value: isOnline } = useTypedEmitter(serialized(online));
  const { value: lastChangeValue } = useTypedEmitter(serialized(lastChange));

  // @ts-ignore
  const { lastSeen: { main: lastSeen } = {} } = ensureKeys(device, 'lastSeen');

  const { value: lastSeenValue } = useTypedEmitter(serialized(lastSeen));

  const timeLabel = useTimeLabel(
    useMemo(() => {
      const epoch = lastSeenValue ?? lastChangeValue;
      if (!epoch) return undefined;

      return new Date(epoch);
    }, [lastChangeValue, lastSeenValue]),
  );

  const time = useMemo(
    () => <TabularNums>{timeLabel || '—'}</TabularNums>,
    [timeLabel],
  );

  if (lastSeen) {
    return (
      <>
        <ActivityIcon height="1em" />
        {time}
      </>
    );
  }

  if (isOnline === undefined) {
    return (
      <>
        <OfflineIcon />—
      </>
    );
  }

  return (
    <>
      {isOnline ? <OnlineIcon /> : <OfflineIcon />}
      {time}
    </>
  );
};

export const Device: FunctionComponent<{
  device: TDevice;
  onClick?: () => void;
  // eslint-disable-next-line arrow-body-style
}> = ({ device, onClick }) => {
  // const { espNow: { device: espNow } = {}, wifi: { device: wifi } = {} } =
  //   useMemo(() => ensureKeys(device, 'espNow', 'wifi'), [device]);

  return (
    <CellWithBody
      icon={<ForwardIcon height="1em" />}
      title={useMemo(() => serialized(device).$path?.at?.(-2), [device])}
      onClick={onClick}
    >
      {/* {espNow && wifi ? (
        <>
          <Tag>
            <TagGroup>
              <DeviceOnlineState device={espNow} />
            </TagGroup>
          </Tag>
          <Tag>
            <TagGroup>
              <WiFiIcon height="1em" />
            </TagGroup>
            <TagGroup>
              <DeviceOnlineState device={wifi} />
            </TagGroup>
          </Tag>
        </>
      ) : ( */}
      <Tag>
        <DeviceOnlineState device={device} />
      </Tag>
      {/* )} */}
    </CellWithBody>
  );
};
