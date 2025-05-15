// /* eslint-disable @typescript-eslint/ban-ts-comment */
import { ensureKeys } from '@iot/iot-monolith/oop';
import { Level, Match, TExclude } from '@iot/iot-monolith/tree';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { LevelObject } from '../api.js';
import { Tag, TagGroup } from '../components/controls.js';
import {
  ActivityIcon,
  CheckIcon,
  ForwardIcon,
  WiFiIcon,
  XIcon,
} from '../components/icons.js';
import { TabularNums } from '../components/text.js';
import { useTimeLabel } from '../hooks/use-time-label.js';
import { useTypedEmitter } from '../state/api.js';
import { $theme } from '../state/theme.js';
import { CellWithBody } from './main.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type TDevice = LevelObject[Level.DEVICE];
export type TSubDevice = Match<{ isSubDevice: true }, TExclude, TDevice>;

export const OnlineIcon: FunctionComponent = () => (
  <CheckIcon
    color={$theme.value === 'highContrast' ? undefined : 'rgb(4, 195, 6)'}
    height="1em"
  />
);

export const OfflineIcon: FunctionComponent = () => (
  <XIcon
    color={$theme.value === 'highContrast' ? undefined : 'rgb(205, 3, 4)'}
    height="1em"
  />
);

const DeviceOnlineState: FunctionComponent<{
  device: TDevice | TSubDevice;
}> = ({ device }) => {
  const {
    online: { lastChange: { main: lastChange } = {}, main: online } = {},
  } = ensureKeys(device, 'online');

  const { value: isOnline } = useTypedEmitter(online);
  const { value: lastChangeValue } = useTypedEmitter(lastChange);

  const { lastSeen: { main: lastSeen } = {} } = ensureKeys(device, 'lastSeen');

  const { value: lastSeenValue } = useTypedEmitter(lastSeen);

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
}> = ({ device, onClick }) => {
  const { espNow, wifi } = useMemo(
    () => ensureKeys(device, 'espNow', 'wifi'),
    [device],
  );

  return (
    <CellWithBody
      icon={<ForwardIcon height="1em" />}
      onClick={onClick}
      title={useMemo(() => device.$path?.at(-1), [device])}
    >
      {espNow && wifi ? (
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
      ) : (
        <Tag>
          <DeviceOnlineState device={device} />
        </Tag>
      )}
    </CellWithBody>
  );
};
