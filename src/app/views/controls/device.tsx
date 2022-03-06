import { HierarchyElementDevice, Levels } from '../../web-api.js';
import { useCallback, useMemo } from 'preact/hooks';
import {
  useChild,
  useElementFilter,
  useGetter,
  useLevelShallowSkipInput,
} from '../../state/web-api.js';
import { FunctionComponent } from 'preact';
import { TabularNums } from '../../components/controls/tabular-nums.js';
import { Wrapper } from '../../components/controls/main.js';
import { useI18nKeyFallback } from '../../state/i18n.js';
import { useTheme } from '../../state/theme.js';
import { useTimeLabel } from '../../util/use-time-label.js';

const zwsp = '\u200b';

const useDeviceOnlineState = (device: HierarchyElementDevice) => {
  const isOnline = useChild(device, 'online');
  const isOnlineValue = useGetter<boolean>(isOnline);

  const onlineLastChange = useChild(isOnline, 'lastChange');
  const onlineLastChangeValue = useGetter<number>(onlineLastChange);

  const lastSeen = useChild(device, 'lastSeen');
  const lastSeenValue = useGetter<number>(lastSeen);

  const onlineLabel = useI18nKeyFallback('online');
  const offlineLabel = useI18nKeyFallback('offline');

  const timeLabel = useTimeLabel(
    useMemo(() => {
      const epoch = lastSeenValue || onlineLastChangeValue;
      if (!epoch) return null;

      return new Date(epoch);
    }, [lastSeenValue, onlineLastChangeValue])
  );

  return useMemo(() => {
    if (lastSeenValue) {
      return `⏱ last seen: ${timeLabel || 'never'}`;
    }

    if (isOnlineValue !== null && onlineLastChangeValue) {
      return `${
        isOnlineValue ? `✅ ${onlineLabel}` : `❌ ${offlineLabel}`
      }: ${timeLabel}`;
    }

    return null;
  }, [
    isOnlineValue,
    lastSeenValue,
    offlineLabel,
    onlineLabel,
    onlineLastChangeValue,
    timeLabel,
  ]);
};

export const Device: FunctionComponent<{ device: HierarchyElementDevice }> = ({
  device,
}) => {
  const theme = useTheme();
  const isHightContrast = useMemo(() => theme === 'highContrast', [theme]);

  const onlineLabel = useDeviceOnlineState(device);

  const subDevices = useElementFilter(
    useCallback(({ isSubDevice }) => Boolean(isSubDevice), []),
    useLevelShallowSkipInput<HierarchyElementDevice>(Levels.DEVICE, device)
  );

  return (
    <Wrapper isHighContrast={isHightContrast}>
      {device.meta.name}
      <br />
      <TabularNums>{onlineLabel || zwsp}</TabularNums>
      {subDevices.map((subDevice) => (
        <Device device={subDevice} />
      ))}
    </Wrapper>
  );
};
