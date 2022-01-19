import { HierarchyElementDevice, Levels } from '../../web-api.js';
import { useDeepLevel, useGetter, useHierarchy } from '../../state/web-api.js';
import { DiagnosticsContainer } from '../../components/diagnostics.js';
import { FunctionComponent } from 'preact';
import { Hierarchy } from './diagnostics.js';
import { OnlineOffline } from '../../components/technical.js';
import { useMemo } from 'preact/hooks';

export const Device: FunctionComponent<{ device: HierarchyElementDevice }> = ({
  device,
}) => {
  const isConnected = useGetter(device.children?.online);
  const element = useMemo(() => <Hierarchy element={device} />, [device]);

  return typeof isConnected === 'boolean' ? (
    <OnlineOffline isConnected={isConnected}>{element}</OnlineOffline>
  ) : (
    element
  );
};

export const Technical: FunctionComponent = () => {
  const hierarchy = useHierarchy();

  const devices = useDeepLevel<HierarchyElementDevice>(
    Levels.DEVICE,
    hierarchy
  );

  return (
    <DiagnosticsContainer>
      {devices.map((device) => (
        <Device device={device} />
      ))}
    </DiagnosticsContainer>
  );
};
