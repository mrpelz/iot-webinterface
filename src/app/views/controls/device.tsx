import { HierarchyElementDevice, Levels } from '../../web-api.js';
import { useCallback, useMemo } from 'preact/hooks';
import {
  useElementFilter,
  useGetter,
  useLevelShallowSkipInput,
} from '../../state/web-api.js';
import { FunctionComponent } from 'preact';
import { TabularNums } from '../../components/controls/tabular-nums.js';
import { Wrapper } from '../../components/controls/main.js';
import { useTimeLabel } from '../../util/use-time-label.js';

const zwsp = '\u200b';

export const Device: FunctionComponent<{ device: HierarchyElementDevice }> = ({
  device,
}) => {
  const { children } = device;

  const isConnectedValue = useGetter<boolean | null>(children?.online);
  const isConnectedLabel = useMemo(() => {
    if (isConnectedValue === null) return null;
    if (isConnectedValue) return '✅';
    return '❌';
  }, [isConnectedValue]);

  const lastSeenValue = useGetter<number>(children?.lastSeen);
  const lastSeenDate = useMemo(() => {
    return lastSeenValue ? new Date(lastSeenValue) : null;
  }, [lastSeenValue]);
  const lastSeenLabel = useTimeLabel(lastSeenDate);

  const subDevices = useElementFilter(
    useCallback(({ isSubDevice }) => Boolean(isSubDevice), []),
    useLevelShallowSkipInput<HierarchyElementDevice>(Levels.DEVICE, device)
  );

  return (
    <Wrapper>
      {device.meta.name}
      <br />
      {isConnectedLabel || zwsp}
      <TabularNums>{lastSeenLabel || zwsp}</TabularNums>
      {subDevices.map((subDevice) => (
        <Device device={subDevice} />
      ))}
    </Wrapper>
  );
};
