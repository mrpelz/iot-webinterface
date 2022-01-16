import { DiagnosticsContainer, Hierarchy } from './diagnostics.js';
import { HierarchyElementDevice, Levels } from '../../web-api.js';
import { useDeepLevel, useGetter, useHierarchy } from '../../hooks/web-api.js';
import { FunctionComponent } from 'preact';
import { dependentValue } from '../../style/main.js';
import { styled } from 'goober';
import { useMemo } from 'preact/hooks';

const OnlineOffline = styled('section')<{ isConnected: boolean }>`
  background-color: ${dependentValue(
    'isConnected',
    'rgba(0, 255, 0, 0.4)',
    'rgba(255, 0, 0, 0.8)'
  )};
`;

export const Device: FunctionComponent<{ device: HierarchyElementDevice }> = ({
  device,
}) => {
  const onlineGetter = device.children?.online;
  const isConnected = Boolean(useGetter(onlineGetter));

  const element = useMemo(() => <Hierarchy element={device} />, [device]);

  return onlineGetter ? (
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
