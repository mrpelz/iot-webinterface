import {
  ActivityIcon,
  CheckIcon,
  ForwardIcon,
  WiFiIcon,
  XIcon,
} from '../components/icons.js';
import { HierarchyElementDevice, Levels, MetaDevice } from '../web-api.js';
import { Tag, TagGroup } from '../components/controls.js';
import {
  useChild,
  useGetter,
  useLevelShallowSkipInput,
  useMetaFilter,
} from '../state/web-api.js';
import { CellWithBody } from './main.js';
import { FunctionComponent } from 'preact';
import { TabularNums } from '../components/text.js';
import { useMemo } from 'preact/hooks';
import { useTheme } from '../state/theme.js';
import { useTimeLabel } from '../hooks/use-time-label.js';

export const OnlineIcon: FunctionComponent = () => {
  const theme = useTheme();
  const isHighContrast = useMemo(() => theme === 'highContrast', [theme]);

  return (
    <CheckIcon
      color={isHighContrast ? undefined : 'rgb(4, 195, 6)'}
      height="1em"
    />
  );
};

export const OfflineIcon: FunctionComponent = () => {
  const theme = useTheme();
  const isHighContrast = useMemo(() => theme === 'highContrast', [theme]);

  return (
    <XIcon color={isHighContrast ? undefined : 'rgb(205, 3, 4)'} height="1em" />
  );
};

const DeviceOnlineState: FunctionComponent<{
  device: HierarchyElementDevice;
}> = ({ device }) => {
  const isOnline = useChild(device, 'online');
  const isOnlineValue = useGetter<boolean>(isOnline);

  const onlineLastChange = useChild(isOnline, 'lastChange');
  const onlineLastChangeValue = useGetter<number>(onlineLastChange);

  const lastSeen = useChild(device, 'lastSeen');
  const lastSeenValue = useGetter<number>(lastSeen);

  const timeLabel = useTimeLabel(
    useMemo(() => {
      const epoch = lastSeenValue || onlineLastChangeValue;
      if (!epoch) return null;

      return new Date(epoch);
    }, [lastSeenValue, onlineLastChangeValue])
  );

  const time = useMemo(
    () => <TabularNums>{timeLabel || '—'}</TabularNums>,
    [timeLabel]
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
    if (isOnlineValue === null) {
      return (
        <>
          <OfflineIcon />—
        </>
      );
    }

    return (
      <>
        {isOnlineValue ? <OnlineIcon /> : <OfflineIcon />}
        {time}
      </>
    );
  }

  return null;
};

export const filterSubDevices = (
  device: MetaDevice
): device is MetaDevice & { isSubDevice: true } => Boolean(device.isSubDevice);

export const Device: FunctionComponent<{
  element: HierarchyElementDevice;
  onClick?: () => void;
}> = ({ element: device, onClick }) => {
  const {
    meta: { name },
  } = device;

  const subDevices = useMetaFilter(
    useLevelShallowSkipInput<HierarchyElementDevice>(Levels.DEVICE, device),
    filterSubDevices
  );

  return (
    <CellWithBody
      icon={<ForwardIcon height="1em" />}
      onClick={onClick}
      title={name}
    >
      {subDevices.length ? (
        subDevices.map((subDevice) => {
          const {
            meta: { name: subDeviceName },
          } = subDevice;

          return (
            <Tag>
              {subDeviceName === 'espNow' ? null : (
                <TagGroup>
                  <WiFiIcon height="1em" />
                </TagGroup>
              )}
              <TagGroup>
                <DeviceOnlineState device={subDevice} />
              </TagGroup>
            </Tag>
          );
        })
      ) : (
        <Tag>
          <DeviceOnlineState device={device} />
        </Tag>
      )}
    </CellWithBody>
  );
};