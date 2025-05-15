import { ensureKeys } from '@iot/iot-monolith/oop';
import { excludePattern } from '@iot/iot-monolith/tree';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { Entry as EntryComponent } from '../../../components/list.js';
import { AlignRight, BreakAll, TabularNums } from '../../../components/text.js';
import { NullActuatorButton } from '../../../controls/actuators/null.js';
import { OfflineIcon, OnlineIcon, TDevice } from '../../../controls/device.js';
import {
  useAbsoluteTimeLabel,
  useDateFromEpoch,
  useRelativeTimeLabel,
} from '../../../hooks/use-time-label.js';
import { useMatch, useTypedEmitter } from '../../../state/api.js';
import { setTitleOverride } from '../../../state/title.js';
import { Entry, List } from '../../../views/list.js';

const SHY_CHARACTER = '\u00AD';

const DeviceDetail: FunctionComponent<{ label: string }> = ({
  label,
  children,
}) => {
  if (!children || (Array.isArray(children) && children.length === 0)) {
    return null;
  }

  return (
    <Entry id={label} label={label}>
      <BreakAll>
        <AlignRight>{children}</AlignRight>
      </BreakAll>
    </Entry>
  );
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const DeviceAddress: FunctionComponent<{ device: TDevice }> = ({ device }) =>
  useMemo(() => {
    const { type } = ensureKeys(device, 'type');
    const { host, port } = ensureKeys(device, 'host', 'port');
    const { identifier } = ensureKeys(device, 'host');

    if (type === 'ESPNowDevice') {
      if (!identifier) return null;

      const annotatedIdentifier = identifier
        .map((byte) => byte.toString(16).padStart(2, '0').toUpperCase())
        .join(':');

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

const DeviceOnline: FunctionComponent<{ device: TDevice }> = ({ device }) => {
  const {
    online: { lastChange: { main: lastChange } = {}, main: online } = {},
  } = useMemo(() => ensureKeys(device, 'online'), [device]);

  const { value: isOnline } = useTypedEmitter(online);

  const onlineLastChangeDate = useDateFromEpoch(
    useTypedEmitter(lastChange).value,
  );

  const onlineChangeLabelAbsolute = useAbsoluteTimeLabel(onlineLastChangeDate);
  const onlineChangeLabelRelative = useRelativeTimeLabel(onlineLastChangeDate);

  const lastSeen = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { lastSeen: { main: lastSeen_ } = {} } = ensureKeys(
      device,
      'lastSeen',
    );

    return lastSeen_;
  }, [device]);

  const lastSeenDate = useDateFromEpoch(useTypedEmitter(lastSeen).value);

  const lastSeenLabelAbsolute = useAbsoluteTimeLabel(lastSeenDate);
  const lastSeenLabelRelative = useRelativeTimeLabel(lastSeenDate);

  return useMemo(
    () => (
      <>
        {isOnline ? (
          <DeviceDetail label="online">
            {isOnline ? <OnlineIcon /> : <OfflineIcon />}
          </DeviceDetail>
        ) : null}
        {lastChange ? (
          <DeviceDetail label="online change">
            <TabularNums>
              {onlineChangeLabelAbsolute || '—'} <br />(
              {onlineChangeLabelRelative || '—'})
            </TabularNums>
          </DeviceDetail>
        ) : null}
        {lastSeen ? (
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
      isOnline,
      lastChange,
      lastSeen,
      lastSeenLabelAbsolute,
      lastSeenLabelRelative,
      onlineChangeLabelAbsolute,
      onlineChangeLabelRelative,
    ],
  );
};

const DeviceHello: FunctionComponent<{ device: TDevice }> = ({ device }) => {
  const { hello: { main: hello } = {} } = useMemo(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    () => ensureKeys(device, 'hello'),
    [device],
  );

  const { value: helloValue } = useTypedEmitter(hello);

  return useMemo(() => {
    if (!helloValue) return null;

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
    ] = helloValue.split(',').map((element) => element || null);

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
  }, [helloValue]);
};

export const DeviceDetailsInner: FunctionComponent<{
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  device: TDevice;
}> = ({ device }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const name = useMemo(() => String(device.$path?.at(-1) ?? ''), [device]);

  const { isSubDevice, transportType, type } = useMemo(
    () => ensureKeys(device, 'isSubDevice', 'transportType', 'type'),
    [device],
  );

  const [identifyDevice] = useMatch(
    { $: 'identifyDevice' as const },
    excludePattern,
    device,
  );

  const [resetDevice] = useMatch(
    { $: 'resetDevice' as const },
    excludePattern,
    device,
  );

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
          {identifyDevice ? (
            <NullActuatorButton actuator={identifyDevice}>
              identify device
            </NullActuatorButton>
          ) : null}
          {resetDevice ? (
            <NullActuatorButton actuator={resetDevice}>
              reset device
            </NullActuatorButton>
          ) : null}
        </EntryComponent>
      ) : null}
    </List>
  );
};

export const DeviceDetails: FunctionComponent<{
  device: TDevice;
}> = ({ device }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const name = useMemo(() => String(device.$path.at(-1) ?? ''), [device]);
  setTitleOverride(name);

  const { espNow, wifi } = useMemo(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    () => ensureKeys(device, 'espNow', 'wifi'),
    [device],
  );

  return (
    <>
      <DeviceDetailsInner device={device} />
      {espNow ? <DeviceDetailsInner device={espNow} /> : null}
      {wifi ? <DeviceDetailsInner device={wifi} /> : null}
    </>
  );
};
