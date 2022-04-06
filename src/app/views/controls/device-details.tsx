import { AlignRight, BreakAll } from '../../components/text.js';
import { Button, Entry as EntryComponent } from '../../components/list.js';
import { Entry, List } from '../list.js';
import { HierarchyElementDevice, Levels } from '../../web-api.js';
import {
  useAbsoluteTimeLabel,
  useRelativeTimeLabel,
} from '../../util/use-time-label.js';
import { useCallback, useMemo } from 'preact/hooks';
import {
  useChild,
  useElementFilter,
  useGetter,
  useLevelShallowSkipInput,
  useSetter,
} from '../../state/web-api.js';
import { FunctionComponent } from 'preact';
import { filterSubDevices } from './device.js';

const SHY_CHARACTER = '\u00ad';

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

      return `${host
        .split('.')
        .join(`${SHY_CHARACTER}.`)}${SHY_CHARACTER}:${port}`;
    }

    return null;
  }, [device]);
};

const useDeviceHello = (device: HierarchyElementDevice) => {
  const hello = useGetter<string>(useChild(device, 'hello'));

  return useMemo(() => {
    if (!hello) return null;

    const [
      ,
      nodeName,
      boardName,
      hardwareName,
      gitRevision,
      pioEnvironment,
      pioPlatform,
      pioFramework,
      chipId,
      flashId,
      ethMacAddress,
      wifiMacAddress,
      wifiBssid,
      wifiChannel,
      wifiRssi,
      wifiPhyMode,
      wifiSsid,
    ] = hello.split(',').map((element) => element || null);

    return {
      boardName,
      chipId,
      ethMacAddress,
      flashId,
      gitRevision,
      hardwareName,
      nodeName,
      pioEnvironment,
      pioFramework,
      pioPlatform,
      wifiBssid,
      wifiChannel,
      wifiMacAddress,
      wifiPhyMode,
      wifiRssi,
      wifiSsid,
    };
  }, [hello]);
};

const DeviceDetail: FunctionComponent<{ label: string }> = ({
  label,
  children,
}) => {
  if (!children || (Array.isArray(children) && !children.length)) return null;

  return (
    <Entry id={label} label={label}>
      <BreakAll>
        <AlignRight>{children}</AlignRight>
      </BreakAll>
    </Entry>
  );
};

export const DeviceDetailsInner: FunctionComponent<{
  device: HierarchyElementDevice;
}> = ({ device }) => {
  const { meta } = device;
  const { isSubDevice, name, transportType, type } = meta;

  const hello = useDeviceHello(device);

  const online = useChild(device, 'online');
  const onlineValue = useGetter<boolean>(online);
  const onlineLabel = useMemo(() => JSON.stringify(onlineValue), [onlineValue]);

  const lastSeen = useChild(device, 'lastSeen');
  const lastSeenValue = useGetter<number>(lastSeen);
  const lastSeenDate = useMemo(
    () => (lastSeenValue ? new Date(lastSeenValue) : null),
    [lastSeenValue]
  );
  const lastSeenLabelAbsolute = useAbsoluteTimeLabel(lastSeenDate);
  const lastSeenLabelRelative = useRelativeTimeLabel(lastSeenDate);

  const onlineChange = useChild(online, 'lastChange');
  const onlineChangeValue = useGetter<number>(onlineChange);
  const onlineChangeDate = useMemo(
    () => (onlineChangeValue ? new Date(onlineChangeValue) : null),
    [onlineChangeValue]
  );
  const onlineChangeLabelAbsolute = useAbsoluteTimeLabel(onlineChangeDate);
  const onlineChangeLabelRelative = useRelativeTimeLabel(onlineChangeDate);

  const identifyDevice = useChild(device, 'identifyDevice');
  const identifyDeviceSetter = useSetter<null>(identifyDevice);
  const identifyDeviceTrigger = useCallback(
    () => identifyDeviceSetter(null),
    [identifyDeviceSetter]
  );

  const resetDevice = useChild(device, 'resetDevice');
  const resetDeviceSetter = useSetter<null>(resetDevice);
  const resetDeviceTrigger = useCallback(
    () => resetDeviceSetter(null),
    [resetDeviceSetter]
  );

  return (
    <List>
      <DeviceDetail label={isSubDevice ? 'sub name' : 'name'}>
        {name}
      </DeviceDetail>
      <DeviceDetail label="type">{type}</DeviceDetail>
      <DeviceDetail label="transport type">{transportType}</DeviceDetail>
      <DeviceDetail label="address">{useDeviceAddress(device)}</DeviceDetail>
      {online ? (
        <DeviceDetail label="online">{onlineLabel}</DeviceDetail>
      ) : null}
      {onlineChange ? (
        <DeviceDetail label="online change">
          {onlineChangeLabelAbsolute || '—'} ({onlineChangeLabelRelative || '—'}
          )
        </DeviceDetail>
      ) : null}
      {lastSeen ? (
        <DeviceDetail label="last seen">
          {lastSeenLabelAbsolute || '—'} ({lastSeenLabelRelative || '—'})
        </DeviceDetail>
      ) : null}

      {hello ? (
        <>
          <DeviceDetail label="node name">{hello.nodeName}</DeviceDetail>
          <DeviceDetail label="board name">{hello.boardName}</DeviceDetail>
          <DeviceDetail label="hardware name">
            {hello.hardwareName}
          </DeviceDetail>
          <DeviceDetail label="chip ID">{hello.chipId}</DeviceDetail>
          <DeviceDetail label="flash ID">{hello.flashId}</DeviceDetail>
          <DeviceDetail label="Ethernet MAC-address">
            {hello.ethMacAddress}
          </DeviceDetail>
          <DeviceDetail label="WiFi MAC-address">
            {hello.wifiMacAddress}
          </DeviceDetail>
          <DeviceDetail label="WiFi SSID">{hello.wifiSsid}</DeviceDetail>
          <DeviceDetail label="WiFi channel">{hello.wifiChannel}</DeviceDetail>
          <DeviceDetail label="WiFi BSSID">{hello.wifiBssid}</DeviceDetail>
          {hello.wifiRssi ? (
            <DeviceDetail label="WiFi RSSI">{hello.wifiRssi} dBm</DeviceDetail>
          ) : null}
          <DeviceDetail label="WiFi Phy-mode">{hello.wifiPhyMode}</DeviceDetail>
          <DeviceDetail label="pio environment">
            {hello.pioEnvironment}
          </DeviceDetail>
          <DeviceDetail label="pio framework">
            {hello.pioFramework}
          </DeviceDetail>
          <DeviceDetail label="pio platform">{hello.pioPlatform}</DeviceDetail>
          <DeviceDetail label="git revision">{hello.gitRevision}</DeviceDetail>
        </>
      ) : null}

      {identifyDevice || resetDevice ? (
        <EntryComponent>
          {identifyDevice ? (
            <Button onClick={identifyDeviceTrigger}>identify device</Button>
          ) : null}
          {resetDevice ? (
            <Button onClick={resetDeviceTrigger}>reset device</Button>
          ) : null}
        </EntryComponent>
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
