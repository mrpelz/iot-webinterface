import { HierarchyElementDevice, Levels } from '../../web-api.js';
import { useGetter, useLevelShallowSkipInput } from '../../state/web-api.js';
import { FunctionComponent } from 'preact';
import { Wrapper } from '../../components/controls/main.js';

export const Device: FunctionComponent<{ device: HierarchyElementDevice }> = ({
  device,
}) => {
  const { children } = device;

  const subDevices = useLevelShallowSkipInput<HierarchyElementDevice>(
    Levels.DEVICE,
    device
  );

  const isConnected = useGetter(children?.online);
  const isConnectedSubDeviceWiFi = useGetter(children?.wifi?.children?.online);
  const vccEspNow = useGetter(children?.espNow?.children?.vcc);

  return (
    <Wrapper>
      {device.meta.name}
      <pre>
        {JSON.stringify(
          {
            isConnected,
            isConnectedSubDeviceWiFi,
            subDevices: subDevices.length,
            vccEspNow,
          },
          undefined,
          2
        )}
      </pre>
    </Wrapper>
  );
};
