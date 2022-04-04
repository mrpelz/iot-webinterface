import { AlignRight, BreakAll } from '../../components/text.js';
import { Entry, List } from '../list.js';
import { HierarchyElementDevice, Levels } from '../../web-api.js';
import {
  useElementFilter,
  useLevelShallowSkipInput,
} from '../../state/web-api.js';
import { FunctionComponent } from 'preact';
import { filterSubDevices } from './device.js';
import { useMemo } from 'preact/hooks';

const useDeviceAddress = (device: HierarchyElementDevice) => {
  return useMemo(() => {
    const { host, identifier, port, type } = device.meta;

    if (type === 'ESPNowDevice') {
      return (
        identifier
          ?.map((byte) => byte.toString(16).padStart(2, '0'))
          .join(':') || null
      );
    }

    if (type === 'Ev1527Device') {
      if (!identifier) return null;

      const array = new Uint8ClampedArray(4);
      array.set(identifier, 1);

      return new DataView(array.buffer).getUint32(0).toString();
    }

    if (type === 'TCPDevice' || type === 'UDPDevice') {
      if (!host || !port) return null;

      return `${host}\u00ad:${port}`;
    }

    return null;
  }, [device]);
};

export const DeviceDetailsInner: FunctionComponent<{
  device: HierarchyElementDevice;
}> = ({ device }) => {
  const { meta } = device;
  const { isSubDevice, transportType, type } = meta;

  const address = useDeviceAddress(device);

  return (
    <List>
      {isSubDevice ? null : (
        <Entry id="name" label="name">
          <BreakAll>
            <AlignRight>{meta.name}</AlignRight>
          </BreakAll>
        </Entry>
      )}

      {type ? (
        <Entry id="type" label="type">
          <BreakAll>
            <AlignRight>{type}</AlignRight>
          </BreakAll>
        </Entry>
      ) : null}
      {transportType ? (
        <Entry id="transportType" label="transportType">
          <BreakAll>
            <AlignRight>{transportType}</AlignRight>
          </BreakAll>
        </Entry>
      ) : null}
      {address ? (
        <Entry id="address" label="address">
          <BreakAll>
            <AlignRight>{address}</AlignRight>
          </BreakAll>
        </Entry>
      ) : null}
    </List>
  );
};

export const DeviceDetails: FunctionComponent<{
  device: HierarchyElementDevice;
}> = ({ device }) => {
  const subDevices = useElementFilter(
    filterSubDevices,
    useLevelShallowSkipInput<HierarchyElementDevice>(Levels.DEVICE, device)
  );

  return (
    <>
      <DeviceDetailsInner device={device} />
      {subDevices
        ? subDevices.map((subDevice) => (
            <DeviceDetailsInner device={subDevice} />
          ))
        : null}
    </>
  );
};
