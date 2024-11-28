import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { api, Level, Match } from '../api.js';
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
import { $theme } from '../state/theme.js';
import { resolve } from '../util/oop.js';
import { getSignal } from '../util/signal.js';
import { CellWithBody } from './main.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type TDevice = Match<{ level: Level.DEVICE }>;
export type TSubDevice = Match<{ isSubDevice: true }, TDevice>;

export const OnlineIcon: FunctionComponent = () => {
  const theme = getSignal($theme);
  const isHighContrast = useMemo(() => theme === 'highContrast', [theme]);

  return (
    <CheckIcon
      color={isHighContrast ? undefined : 'rgb(4, 195, 6)'}
      height="1em"
    />
  );
};

export const OfflineIcon: FunctionComponent = () => {
  const theme = getSignal($theme);
  const isHighContrast = useMemo(() => theme === 'highContrast', [theme]);

  return (
    <XIcon color={isHighContrast ? undefined : 'rgb(205, 3, 4)'} height="1em" />
  );
};

const DeviceOnlineState: FunctionComponent<{
  device: TDevice;
}> = ({ device }) => {
  const { isOnline, onlineLastChange } = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { online } = resolve(device, 'online');
    return online
      ? {
          isOnline: api.$typedEmitter(online.main),
          onlineLastChange: api.$typedEmitter(online.lastChange.main),
        }
      : {};
  }, [device]);

  const lastSeen = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { lastSeen: lastSeen_ } = resolve(device, 'lastSeen');
    return lastSeen_ ? api.$typedEmitter(lastSeen_.main) : undefined;
  }, [device]);

  const timeLabel = useTimeLabel(
    useMemo(() => {
      const epoch = lastSeen?.value || onlineLastChange?.value;
      if (!epoch) return undefined;

      return new Date(epoch);
    }, [lastSeen, onlineLastChange]),
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

  if (isOnline) {
    if (isOnline === undefined) {
      return (
        <>
          <OfflineIcon />—
        </>
      );
    }

    return (
      <>
        {isOnline.value ? <OnlineIcon /> : <OfflineIcon />}
        {time}
      </>
    );
  }

  return null;
};

export const Device: FunctionComponent<{
  device: TDevice;
  onClick?: () => void;
}> = ({ device, onClick }) => {
  const { espNow, wifi } = useMemo(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    () => resolve(device, 'espNow', 'wifi'),
    [device],
  );

  return (
    <CellWithBody
      icon={<ForwardIcon height="1em" />}
      onClick={onClick}
      title={useMemo(() => device.$ref.path.at(-1), [device])}
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
