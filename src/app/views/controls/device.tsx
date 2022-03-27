import {
  ActivityIcon,
  CheckIcon,
  TargetIcon,
  WiFiIcon,
  XIcon,
} from '../../components/icons.js';
import { HierarchyElementDevice, Levels } from '../../web-api.js';
import { Tag, TagGroup } from '../../components/controls/main.js';
import { useCallback, useMemo } from 'preact/hooks';
import {
  useChild,
  useElementFilter,
  useGetter,
  useLevelShallowSkipInput,
} from '../../state/web-api.js';
import { Cell } from './main.js';
import { FunctionComponent } from 'preact';
import { TabularNums } from '../../components/controls/tabular-nums.js';
import { useTheme } from '../../state/theme.js';
import { useTimeLabel } from '../../util/use-time-label.js';

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

  const theme = useTheme();
  const isHighContrast = useMemo(() => theme === 'highContrast', [theme]);

  if (lastSeen) {
    return (
      <>
        <ActivityIcon height="1em" />
        {time}
      </>
    );
  }

  if (isOnlineValue !== null) {
    return (
      <>
        {isOnlineValue ? (
          <CheckIcon
            color={isHighContrast ? undefined : 'rgb(4, 195, 6)'}
            height="1em"
          />
        ) : (
          <XIcon
            color={isHighContrast ? undefined : 'rgb(205, 3, 4)'}
            height="1em"
          />
        )}
        {time}
      </>
    );
  }

  return null;
};

export const Device: FunctionComponent<{
  device: HierarchyElementDevice;
  onSelect?: () => void;
}> = ({ device, onSelect }) => {
  const subDevices = useElementFilter(
    useCallback(({ isSubDevice }) => Boolean(isSubDevice), []),
    useLevelShallowSkipInput<HierarchyElementDevice>(Levels.DEVICE, device)
  );

  return (
    <Cell title={device.meta.name} onClick={onSelect}>
      {subDevices.length ? (
        subDevices.map((subDevice) => (
          <Tag>
            <TagGroup>
              {subDevice.meta.name === 'espNow' ? (
                <TargetIcon height="1em" />
              ) : (
                <WiFiIcon height="1em" />
              )}
            </TagGroup>
            <DeviceOnlineState device={subDevice} />
          </Tag>
        ))
      ) : (
        <Tag>
          <DeviceOnlineState device={device} />
        </Tag>
      )}
    </Cell>
  );
};
