import { HierarchyElementDevice, Levels } from '../../web-api.js';
import {
  useElementFilter,
  useGetter,
  useLevelShallowSkipInput,
} from '../../state/web-api.js';
import { FunctionComponent } from 'preact';
import { Wrapper } from '../../components/controls/main.js';
import { useCallback } from 'preact/hooks';
import { useI18n } from '../../state/i18n.js';
import { useMemoShorthand } from '../../util/use-memo-shorthand.js';

export const Device: FunctionComponent<{ device: HierarchyElementDevice }> = ({
  device,
}) => {
  const { children } = device;

  const isConnected = useMemoShorthand(
    useGetter<boolean | null>(children?.online),
    useCallback((value) => {
      if (value === null) return null;
      if (value) return '✅';
      return '❌';
    }, [])
  );

  const lastSeen = useMemoShorthand(
    [useGetter<number>(children?.lastSeen), useI18n()] as const,
    useCallback(([seen, { locale }]) => {
      return seen
        ? new Date(seen).toLocaleTimeString(locale || undefined)
        : null;
    }, [])
  );

  const subDevices = useElementFilter(
    useCallback(({ isSubDevice }) => Boolean(isSubDevice), []),
    useLevelShallowSkipInput<HierarchyElementDevice>(Levels.DEVICE, device)
  );

  return (
    <Wrapper>
      {device.meta.name}
      <br />
      {isConnected}
      {lastSeen}
      {subDevices.map((subDevice) => (
        <Device device={subDevice} />
      ))}
    </Wrapper>
  );
};
