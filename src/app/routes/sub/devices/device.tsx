import { AlignRight, BreakAll, TabularNums } from '../../../components/text.js';
import { Entry, List } from '../../../views/list.js';
import { HierarchyElementDevice, Levels } from '../../../web-api.js';
import {
  NullActuatorButton,
  isNullActuatorElement,
} from '../../../controls/actuators/null.js';
import {
  OfflineIcon,
  OnlineIcon,
  filterSubDevices,
} from '../../../controls/device.js';
import {
  useAbsoluteTimeLabel,
  useDateFromEpoch,
  useRelativeTimeLabel,
} from '../../../hooks/use-time-label.js';
import {
  useChild,
  useChildGetter,
  useGetter,
  useLevelShallowSkipInput,
  useMetaFilter,
} from '../../../state/web-api.js';
import { Entry as EntryComponent } from '../../../components/list.js';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';
import { useSetTitleOverride } from '../../../state/title.js';

const SHY_CHARACTER = '\u00ad';

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

const DeviceAddress: FunctionComponent<{ device: HierarchyElementDevice }> = ({
  device,
}) => {
  return useMemo(() => {
    const { host, identifier, port, type } = device.meta;

    if (type === 'ESPNowDevice') {
      const annotatedIdentifier =
        identifier
          ?.map((byte) => byte.toString(16).padStart(2, '0').toUpperCase())
          .join(':') || null;

      return (
        <DeviceDetail label="WiFi MAC-address">
          {annotatedIdentifier}
        </DeviceDetail>
      );
    }

    if (type === 'Ev1527Device') {
      if (!identifier) return null;

      const array = new Uint8ClampedArray(4);
      array.set(identifier, 1);

      const annotatedIdentifier = new DataView(array.buffer)
        .getUint32(0)
        .toString();

      return (
        <DeviceDetail label="identifier">{annotatedIdentifier}</DeviceDetail>
      );
    }

    if (type === 'TCPDevice' || type === 'UDPDevice') {
      if (!host || !port) return null;

      const annotatedHost = `${host.split('.').join(`${SHY_CHARACTER}.`)}`;
      const annotatedPort = `${type === 'TCPDevice' ? 'tcp' : 'udp'}/${port}`;

      return (
        <>
          <DeviceDetail label="host">{annotatedHost}</DeviceDetail>
          <DeviceDetail label="port">{annotatedPort}</DeviceDetail>
        </>
      );
    }

    return null;
  }, [device]);
};

const DeviceOnline: FunctionComponent<{ device: HierarchyElementDevice }> = ({
  device,
}) => {
  const online = useChild(device, 'online');
  const isOnlineValue = useGetter<boolean>(online);

  const lastSeenDate = useDateFromEpoch(
    useChildGetter<number>(device, 'lastSeen')
  );
  const lastSeenLabelAbsolute = useAbsoluteTimeLabel(lastSeenDate);
  const lastSeenLabelRelative = useRelativeTimeLabel(lastSeenDate);

  const onlineChangeDate = useDateFromEpoch(
    useChildGetter<number>(online, 'lastChange')
  );
  const onlineChangeLabelAbsolute = useAbsoluteTimeLabel(onlineChangeDate);
  const onlineChangeLabelRelative = useRelativeTimeLabel(onlineChangeDate);

  return useMemo(
    () => (
      <>
        {online ? (
          <DeviceDetail label="online">
            {isOnlineValue ? <OnlineIcon /> : <OfflineIcon />}
          </DeviceDetail>
        ) : null}
        {onlineChangeDate ? (
          <DeviceDetail label="online change">
            <TabularNums>
              {onlineChangeLabelAbsolute || '—'} <br />(
              {onlineChangeLabelRelative || '—'})
            </TabularNums>
          </DeviceDetail>
        ) : null}
        {lastSeenDate ? (
          <DeviceDetail label="last seen">
            <TabularNums>
              {lastSeenLabelAbsolute || '—'} <br />(
              {lastSeenLabelRelative || '—'})
            </TabularNums>
          </DeviceDetail>
        ) : null}
      </>
    ),
    [
      isOnlineValue,
      lastSeenDate,
      lastSeenLabelAbsolute,
      lastSeenLabelRelative,
      online,
      onlineChangeDate,
      onlineChangeLabelAbsolute,
      onlineChangeLabelRelative,
    ]
  );
};

const DeviceHello: FunctionComponent<{ device: HierarchyElementDevice }> = ({
  device,
}) => {
  const hello = useChildGetter<string>(device, 'hello');

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

    return (
      <>
        <DeviceDetail label="node name">{nodeName}</DeviceDetail>
        <DeviceDetail label="board name">{boardName}</DeviceDetail>
        <DeviceDetail label="hardware name">{hardwareName}</DeviceDetail>
        <DeviceDetail label="chip ID">{chipId}</DeviceDetail>
        <DeviceDetail label="flash ID">{flashId}</DeviceDetail>
        <DeviceDetail label="Ethernet MAC-address">
          {ethMacAddress}
        </DeviceDetail>
        <DeviceDetail label="WiFi MAC-address">{wifiMacAddress}</DeviceDetail>
        <DeviceDetail label="WiFi SSID">{wifiSsid}</DeviceDetail>
        <DeviceDetail label="WiFi channel">{wifiChannel}</DeviceDetail>
        <DeviceDetail label="WiFi BSSID">{wifiBssid}</DeviceDetail>
        {wifiRssi ? (
          <DeviceDetail label="WiFi RSSI">{wifiRssi} dBm</DeviceDetail>
        ) : null}
        <DeviceDetail label="WiFi Phy-mode">{wifiPhyMode}</DeviceDetail>
        <DeviceDetail label="pio environment">{pioEnvironment}</DeviceDetail>
        <DeviceDetail label="pio framework">{pioFramework}</DeviceDetail>
        <DeviceDetail label="pio platform">{pioPlatform}</DeviceDetail>
        <DeviceDetail label="git revision">{gitRevision}</DeviceDetail>
      </>
    );
  }, [hello]);
};

export const DeviceDetailsInner: FunctionComponent<{
  device: HierarchyElementDevice;
}> = ({ device }) => {
  const { meta } = device;
  const { isSubDevice, name, transportType, type } = meta;

  const identifyDevice = useChild(device, 'identifyDevice');
  const resetDevice = useChild(device, 'resetDevice');

  return (
    <List>
      <DeviceDetail label={isSubDevice ? 'sub name' : 'name'}>
        {name}
      </DeviceDetail>
      <DeviceDetail label="type">{type}</DeviceDetail>
      <DeviceDetail label="transport type">{transportType}</DeviceDetail>

      <DeviceAddress device={device} />

      <DeviceOnline device={device} />

      <DeviceHello device={device} />

      {identifyDevice || resetDevice ? (
        <EntryComponent>
          {identifyDevice && isNullActuatorElement(identifyDevice) ? (
            <NullActuatorButton element={identifyDevice}>
              identify device
            </NullActuatorButton>
          ) : null}
          {resetDevice && isNullActuatorElement(resetDevice) ? (
            <NullActuatorButton element={resetDevice}>
              reset device
            </NullActuatorButton>
          ) : null}
        </EntryComponent>
      ) : null}
    </List>
  );
};

export const DeviceDetails: FunctionComponent<{
  device: HierarchyElementDevice;
}> = ({ device }) => {
  const {
    meta: { name },
  } = device;

  useSetTitleOverride(name);

  const subDevices = useMetaFilter(
    useLevelShallowSkipInput<HierarchyElementDevice>(Levels.DEVICE, device),
    filterSubDevices
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
