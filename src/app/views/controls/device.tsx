import { HierarchyElementDevice, Levels } from '../../web-api.js';
import { useCallback, useMemo } from 'preact/hooks';
import {
  useElementFilter,
  useGetter,
  useLevelShallowSkipInput,
} from '../../state/web-api.js';
import { FunctionComponent } from 'preact';
import { Wrapper } from '../../components/controls/main.js';
import { useI18n } from '../../state/i18n.js';

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

  const { locale } = useI18n();
  const lastSeenValue = useGetter<number>(children?.lastSeen);
  const lastSeenLabel = useMemo(() => {
    return lastSeenValue
      ? new Date(lastSeenValue).toLocaleTimeString(locale || undefined)
      : null;
  }, [lastSeenValue, locale]);

  const subDevices = useElementFilter(
    useCallback(({ isSubDevice }) => Boolean(isSubDevice), []),
    useLevelShallowSkipInput<HierarchyElementDevice>(Levels.DEVICE, device)
  );

  return (
    <Wrapper>
      {device.meta.name}
      <br />
      {isConnectedLabel}
      {lastSeenLabel}
      {subDevices.map((subDevice) => (
        <Device device={subDevice} />
      ))}
    </Wrapper>
  );
};
