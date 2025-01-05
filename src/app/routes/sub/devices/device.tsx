/* eslint-disable unicorn/no-empty-file */
// /* eslint-disable @typescript-eslint/ban-ts-comment */
// import { Level, Match } from '@iot/iot-monolith/tree';
// import { FunctionComponent } from 'preact';
// import { useMemo } from 'preact/hooks';

// import { LevelObject } from '../../../api.js';
// import { Entry as EntryComponent } from '../../../components/list.js';
// import { AlignRight, BreakAll, TabularNums } from '../../../components/text.js';
// import {
//   isNullActuatorElement,
//   NullActuatorButton,
// } from '../../../controls/actuators/null.js';
// import { OfflineIcon, OnlineIcon } from '../../../controls/device.js';
// import {
//   useAbsoluteTimeLabel,
//   useDateFromEpoch,
//   useRelativeTimeLabel,
// } from '../../../hooks/use-time-label.js';
// import { useKey, useMatch } from '../../../state/api.js';
// import { useSetTitleOverride } from '../../../state/title.js';
// import { useChild, useChildGetter, useGetter } from '../../../state/web-api.js';
// import { ensureKeys } from '../../../util/oop.js';
// import { Entry, List } from '../../../views/list.js';
// import { HierarchyElementDevice } from '../../../web-api.js';

// const SHY_CHARACTER = '\u00AD';

// const DeviceDetail: FunctionComponent<{ label: string }> = ({
//   label,
//   children,
// }) => {
//   if (!children || (Array.isArray(children) && children.length === 0)) {
//     return null;
//   }

//   return (
//     <Entry id={label} label={label}>
//       <BreakAll>
//         <AlignRight>{children}</AlignRight>
//       </BreakAll>
//     </Entry>
//   );
// };

// const DeviceAddress: FunctionComponent<{ device: HierarchyElementDevice }> = ({
//   device,
// }) =>
//   useMemo(() => {
//     const { host, identifier, port, type } = device.meta;

//     if (type === 'ESPNowDevice') {
//       const annotatedIdentifier =
//         identifier
//           ?.map((byte) => byte.toString(16).padStart(2, '0').toUpperCase())
//           .join(':') || null;

//       return (
//         <DeviceDetail label="WiFi MAC-address">
//           {annotatedIdentifier}
//         </DeviceDetail>
//       );
//     }

//     if (type === 'Ev1527Device') {
//       if (!identifier) return null;

//       const array = new Uint8ClampedArray(4);
//       array.set(identifier, 1);

//       const annotatedIdentifier = new DataView(array.buffer)
//         .getUint32(0)
//         .toString();

//       return (
//         <DeviceDetail label="identifier">{annotatedIdentifier}</DeviceDetail>
//       );
//     }

//     if (type === 'TCPDevice' || type === 'UDPDevice') {
//       if (!host || !port) return null;

//       const annotatedHost = `${host.split('.').join(`${SHY_CHARACTER}.`)}`;
//       const annotatedPort = `${type === 'TCPDevice' ? 'tcp' : 'udp'}/${port}`;

//       return (
//         <>
//           <DeviceDetail label="host">{annotatedHost}</DeviceDetail>
//           <DeviceDetail label="port">{annotatedPort}</DeviceDetail>
//         </>
//       );
//     }

//     return null;
//   }, [device]);

// const DeviceOnline: FunctionComponent<{ device: HierarchyElementDevice }> = ({
//   device,
// }) => {
//   const online = useChild(device, 'online');
//   const isOnlineValue = useGetter<boolean>(online);

//   const lastSeenDate = useDateFromEpoch(
//     useChildGetter<number>(device, 'lastSeen'),
//   );
//   const lastSeenLabelAbsolute = useAbsoluteTimeLabel(lastSeenDate);
//   const lastSeenLabelRelative = useRelativeTimeLabel(lastSeenDate);

//   const onlineChangeDate = useDateFromEpoch(
//     useChildGetter<number>(online, 'lastChange'),
//   );
//   const onlineChangeLabelAbsolute = useAbsoluteTimeLabel(onlineChangeDate);
//   const onlineChangeLabelRelative = useRelativeTimeLabel(onlineChangeDate);

//   return useMemo(
//     () => (
//       <>
//         {online ? (
//           <DeviceDetail label="online">
//             {isOnlineValue ? <OnlineIcon /> : <OfflineIcon />}
//           </DeviceDetail>
//         ) : null}
//         {onlineChangeDate ? (
//           <DeviceDetail label="online change">
//             <TabularNums>
//               {onlineChangeLabelAbsolute || '—'} <br />(
//               {onlineChangeLabelRelative || '—'})
//             </TabularNums>
//           </DeviceDetail>
//         ) : null}
//         {lastSeenDate ? (
//           <DeviceDetail label="last seen">
//             <TabularNums>
//               {lastSeenLabelAbsolute || '—'} <br />(
//               {lastSeenLabelRelative || '—'})
//             </TabularNums>
//           </DeviceDetail>
//         ) : null}
//       </>
//     ),
//     [
//       isOnlineValue,
//       lastSeenDate,
//       lastSeenLabelAbsolute,
//       lastSeenLabelRelative,
//       online,
//       onlineChangeDate,
//       onlineChangeLabelAbsolute,
//       onlineChangeLabelRelative,
//     ],
//   );
// };

// const DeviceHello: FunctionComponent<{ device: HierarchyElementDevice }> = ({
//   device,
// }) => {
//   const hello = useChildGetter<string>(device, 'hello');

//   return useMemo(() => {
//     if (!hello) return null;

//     const [
//       ,
//       nodeName,
//       boardName,
//       hardwareName,
//       gitRevision,
//       pioEnvironment,
//       pioPlatform,
//       pioFramework,
//       chipId,
//       flashId,
//       ethMacAddress,
//       wifiMacAddress,
//       wifiBssid,
//       wifiChannel,
//       wifiRssi,
//       wifiPhyMode,
//       wifiSsid,
//     ] = hello.split(',').map((element) => element || null);

//     return (
//       <>
//         <DeviceDetail label="node name">{nodeName}</DeviceDetail>
//         <DeviceDetail label="board name">{boardName}</DeviceDetail>
//         <DeviceDetail label="hardware name">{hardwareName}</DeviceDetail>
//         <DeviceDetail label="chip ID">{chipId}</DeviceDetail>
//         <DeviceDetail label="flash ID">{flashId}</DeviceDetail>
//         <DeviceDetail label="Ethernet MAC-address">
//           {ethMacAddress}
//         </DeviceDetail>
//         <DeviceDetail label="WiFi MAC-address">{wifiMacAddress}</DeviceDetail>
//         <DeviceDetail label="WiFi SSID">{wifiSsid}</DeviceDetail>
//         <DeviceDetail label="WiFi channel">{wifiChannel}</DeviceDetail>
//         <DeviceDetail label="WiFi BSSID">{wifiBssid}</DeviceDetail>
//         {wifiRssi ? (
//           <DeviceDetail label="WiFi RSSI">{wifiRssi} dBm</DeviceDetail>
//         ) : null}
//         <DeviceDetail label="WiFi Phy-mode">{wifiPhyMode}</DeviceDetail>
//         <DeviceDetail label="pio environment">{pioEnvironment}</DeviceDetail>
//         <DeviceDetail label="pio framework">{pioFramework}</DeviceDetail>
//         <DeviceDetail label="pio platform">{pioPlatform}</DeviceDetail>
//         <DeviceDetail label="git revision">{gitRevision}</DeviceDetail>
//       </>
//     );
//   }, [hello]);
// };

// export const DeviceDetailsInner: FunctionComponent<{
//   device: // @ts-ignore
//   | LevelObject[Level.DEVICE]
//     | Match<
//         { isSubDevice: true; level: Level.DEVICE },
//         LevelObject[Level.DEVICE],
//         1
//       >;
// }> = ({ device }) => {
//   const { $, isSubDevice, transportType, type } = ensureKeys(device, '');

//   const identifyDevice = useChild(device, 'identifyDevice');
//   const resetDevice = useChild(device, 'resetDevice');

//   return (
//     <List>
//       <DeviceDetail label={isSubDevice ? 'sub name' : 'name'}>
//         {name}
//       </DeviceDetail>
//       <DeviceDetail label="type">{type}</DeviceDetail>
//       <DeviceDetail label="transport type">{transportType}</DeviceDetail>

//       <DeviceAddress device={device} />

//       <DeviceOnline device={device} />

//       <DeviceHello device={device} />

//       {identifyDevice || resetDevice ? (
//         <EntryComponent>
//           {identifyDevice && isNullActuatorElement(identifyDevice) ? (
//             <NullActuatorButton element={identifyDevice}>
//               identify device
//             </NullActuatorButton>
//           ) : null}
//           {resetDevice && isNullActuatorElement(resetDevice) ? (
//             <NullActuatorButton element={resetDevice}>
//               reset device
//             </NullActuatorButton>
//           ) : null}
//         </EntryComponent>
//       ) : null}
//     </List>
//   );
// };

// export const DeviceDetails: FunctionComponent<{
//   // @ts-ignore
//   device: LevelObject[Level.DEVICE];
// }> = ({ device }) => {
//   useSetTitleOverride(useKey(device));

//   const subDevices = useMatch(
//     { isSubDevice: true as const, level: Level.DEVICE as const },
//     device,
//     1,
//   );

//   return (
//     <>
//       <DeviceDetailsInner device={device} />
//       {subDevices
//         ? subDevices.map((subDevice) => (
//             <DeviceDetailsInner device={subDevice} />
//           ))
//         : null}
//     </>
//   );
// };
