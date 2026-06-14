import { excludePattern } from '@iot/iot-monolith/tree';
import { ensureKeys } from '@mrpelz/misc-utils/oop';
import { FunctionComponent } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

import { serialized } from '../../../api.js';
import { Button, Entry as EntryComponent } from '../../../components/list.js';
import { AlignRight, BreakAll, TabularNums } from '../../../components/text.js';
import { NullActuatorButton } from '../../../controls/actuators/null.js';
import {
  OfflineIcon,
  OnlineIcon,
  TDevice,
  TMainDevice,
  TSubDevice,
} from '../../../controls/device.js';
import {
  useMatch,
  useTypedCollector,
  useTypedCollectorEmitter,
  useTypedEmitter,
} from '../../../hooks/use-api.js';
import {
  useAbsoluteTimeLabel,
  useDateFromEpoch,
  useRelativeTimeLabel,
} from '../../../hooks/use-time-label.js';
import { useTitleOverride } from '../../../state/title.js';
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
const DeviceAddress: FunctionComponent<{
  device: TMainDevice | TSubDevice;
}> = ({ device }) =>
  useMemo(() => {
    const { type } = ensureKeys(device, 'type');
    const { host, port } = ensureKeys(device, 'host', 'port');
    const { identifier } = ensureKeys(device, 'identifier');

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

const DeviceOnline: FunctionComponent<{ device: TMainDevice | TSubDevice }> = ({
  device,
}) => {
  const {
    online: { lastChange: { main: lastChange } = {}, main: online } = {},
  } = useMemo(() => ensureKeys(device, 'online'), [device]);

  const { value: isOnline } = useTypedEmitter(serialized(online));
  const { value: isSetOnline } = useTypedCollectorEmitter(serialized(online));

  const onlineLastChangeDate = useDateFromEpoch(
    useTypedEmitter(serialized(lastChange)).value,
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

  const lastSeenDate = useDateFromEpoch(
    useTypedEmitter(serialized(lastSeen)).value,
  );

  const lastSeenLabelAbsolute = useAbsoluteTimeLabel(lastSeenDate);
  const lastSeenLabelRelative = useRelativeTimeLabel(lastSeenDate);

  return useMemo(
    () => (
      <>
        {isSetOnline === undefined ? null : (
          <DeviceDetail label="setOnline">
            {isSetOnline ? <OnlineIcon /> : <OfflineIcon />}
          </DeviceDetail>
        )}
        {isOnline === undefined ? null : (
          <DeviceDetail label="online">
            {isOnline ? <OnlineIcon /> : <OfflineIcon />}
          </DeviceDetail>
        )}
        {lastChange === undefined ? null : (
          <DeviceDetail label="online change">
            <TabularNums>
              {onlineChangeLabelAbsolute || '—'} <br />(
              {onlineChangeLabelRelative || '—'})
            </TabularNums>
          </DeviceDetail>
        )}
        {lastSeen === undefined ? null : (
          <DeviceDetail label="last seen">
            <TabularNums>
              {lastSeenLabelAbsolute || '—'} <br />(
              {lastSeenLabelRelative || '—'})
            </TabularNums>
          </DeviceDetail>
        )}
      </>
    ),
    [
      isOnline,
      isSetOnline,
      lastChange,
      lastSeen,
      lastSeenLabelAbsolute,
      lastSeenLabelRelative,
      onlineChangeLabelAbsolute,
      onlineChangeLabelRelative,
    ],
  );
};

const DeviceHello: FunctionComponent<{ device: TMainDevice | TSubDevice }> = ({
  device,
}) => {
  const { hello: { main: hello } = {} } = useMemo(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    () => ensureKeys(device, 'hello'),
    [device],
  );

  const { value: helloValue } = useTypedEmitter(serialized(hello));

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
      dieTemp,
    ] = helloValue.split(',').map((element) => element || null);

    return (
      <>
        <DeviceDetail label="node name">{nodeName}</DeviceDetail>
        <DeviceDetail label="board name">{boardName}</DeviceDetail>
        <DeviceDetail label="hardware name">{hardwareName}</DeviceDetail>
        <DeviceDetail label="chip ID">{chipId}</DeviceDetail>
        <DeviceDetail label="flash ID">{flashId}</DeviceDetail>
        {!dieTemp || dieTemp === 'BYE' ? null : (
          <DeviceDetail label="die temperature">{dieTemp}</DeviceDetail>
        )}
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
  device: TMainDevice | TSubDevice;
}> = ({ device }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const name = useMemo(() => String(device.$path?.at(-2) ?? ''), [device]);

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

  const [online] = useMatch({ $: 'online' as const }, excludePattern, device);
  const flipOnline = useTypedCollector(serialized(online?.flip));
  const handleFlipOnlineClick = useCallback(
    () => flipOnline?.(null),
    [flipOnline],
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

      {online?.flip || identifyDevice || resetDevice ? (
        <EntryComponent>
          {online?.flip ? (
            <Button onClick={handleFlipOnlineClick}>flip online state</Button>
          ) : null}
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
  const name = useMemo(() => String(device.$path.at(-2) ?? ''), [device]);
  useTitleOverride(name);

  const { espNow: { device: espNow } = {}, wifi: { device: wifi } = {} } =
    useMemo(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      () => ensureKeys(device, 'espNow', 'wifi'),
      [device],
    );

  return (
    <>
      <DeviceDetailsInner device={device as TMainDevice} />
      {espNow ? <DeviceDetailsInner device={espNow} /> : null}
      {wifi ? <DeviceDetailsInner device={wifi} /> : null}
    </>
  );
};
