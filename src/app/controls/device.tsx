/* eslint-disable unicorn/no-empty-file */
// /* eslint-disable @typescript-eslint/ban-ts-comment */
// import { Level, Match } from '@iot/iot-monolith/tree';
// import { computed } from '@preact/signals';
// import { FunctionComponent } from 'preact';
// import { useMemo } from 'preact/hooks';

// import { TSerialization } from '../../common/types.js';
// import { Tag, TagGroup } from '../components/controls.js';
// import {
//   ActivityIcon,
//   CheckIcon,
//   ForwardIcon,
//   WiFiIcon,
//   XIcon,
// } from '../components/icons.js';
// import { TabularNums } from '../components/text.js';
// import { useTimeLabel } from '../hooks/use-time-label.js';
// import { useKey, useMatch, useTypedEmitter } from '../state/api.js';
// import { useTheme } from '../state/theme.js';
// import { ensureKeys } from '../util/oop.js';
// import { CellWithBody } from './main.js';

// export const OnlineIcon: FunctionComponent = () => {
//   const theme = useTheme();
//   const isHighContrast = useMemo(() => theme === 'highContrast', [theme]);

//   return (
//     <CheckIcon
//       color={isHighContrast ? undefined : 'rgb(4, 195, 6)'}
//       height="1em"
//     />
//   );
// };

// export const OfflineIcon: FunctionComponent = () => {
//   const theme = useTheme();
//   const isHighContrast = useMemo(() => theme === 'highContrast', [theme]);

//   return (
//     <XIcon color={isHighContrast ? undefined : 'rgb(205, 3, 4)'} height="1em" />
//   );
// };

// const DeviceOnlineState: FunctionComponent<{
//   device: // @ts-ignore
//   | Match<{ isSubDevice: false; level: Level.DEVICE }, TSerialization>
//     | Match<{ isSubDevice: true; level: Level.DEVICE }, TSerialization, 7>;
// }> = ({ device }) => {
//   const {
//     online: {
//       lastChange: { main: lastChange },
//       main: online,
//     },
//     // @ts-ignore
//   } = ensureKeys(device, 'online');
//   const isOnline = useTypedEmitter(online);
//   const onlineChanged = useTypedEmitter(lastChange);

//   const {
//     lastSeen: { main: lastSeen },
//     // @ts-ignore
//   } = ensureKeys(device, 'lastSeen');
//   const wasLastSeen = useTypedEmitter(lastSeen);

//   const date = computed(() => {
//     const epoch = onlineChanged.value || wasLastSeen.value;
//     if (!epoch) return undefined;

//     return new Date(epoch);
//   });

//   const timeLabel = useTimeLabel(date.value);

//   const time = useMemo(
//     () => <TabularNums>{timeLabel || '—'}</TabularNums>,
//     [timeLabel],
//   );

//   if (lastSeen) {
//     return (
//       <>
//         <ActivityIcon height="1em" />
//         {time}
//       </>
//     );
//   }

//   if (online) {
//     if (isOnline.value === undefined) {
//       return (
//         <>
//           <OfflineIcon />—
//         </>
//       );
//     }

//     return (
//       <>
//         {isOnline.value ? <OnlineIcon /> : <OfflineIcon />}
//         {time}
//       </>
//     );
//   }

//   return null;
// };

// export const SubDevice: FunctionComponent<{
//   // @ts-ignore
//   subDevice: Match<
//     { isSubDevice: true; level: Level.DEVICE },
//     TSerialization,
//     7
//   >;
// }> = ({ subDevice }) => {
//   const subDeviceName = useKey(subDevice);

//   return (
//     <Tag>
//       {subDeviceName === 'espNow' ? null : (
//         <TagGroup>
//           <WiFiIcon height="1em" />
//         </TagGroup>
//       )}
//       <TagGroup>
//         <DeviceOnlineState device={subDevice} />
//       </TagGroup>
//     </Tag>
//   );
// };

// export const Device: FunctionComponent<{
//   // @ts-ignore
//   device: Match<{ isSubDevice: false; level: Level.DEVICE }, TSerialization>;
//   onClick?: () => void;
// }> = ({ device, onClick }) => {
//   // @ts-ignore
//   const name = useKey(device);

//   const subDevices = useMatch(
//     { isSubDevice: true as const, level: Level.DEVICE as const },
//     device,
//     1,
//   );

//   return (
//     <CellWithBody
//       icon={<ForwardIcon height="1em" />}
//       onClick={onClick}
//       title={name}
//     >
//       {subDevices.length > 0 ? (
//         subDevices.map((subDevice) => <SubDevice subDevice={subDevice} />)
//       ) : (
//         <Tag>
//           <DeviceOnlineState
//             device={
//               // @ts-ignore
//               device
//             }
//           />
//         </Tag>
//       )}
//     </CellWithBody>
//   );
// };
