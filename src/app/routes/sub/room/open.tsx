/* eslint-disable unicorn/no-empty-file */
// import { FunctionComponent } from 'preact';
// import { useMemo } from 'preact/hooks';

// import { AlignRight, TabularNums } from '../../../components/text.js';
// import { OpenSensorElement } from '../../../controls/sensor/open.js';
// import {
//   useAbsoluteTimeLabel,
//   useDateFromEpoch,
//   useRelativeTimeLabel,
// } from '../../../hooks/use-time-label.js';
// import { Translation, useI18nKey } from '../../../state/i18n.js';
// import { useSetTitleOverride } from '../../../state/title.js';
// import { useChild, useChildGetter, useGetter } from '../../../state/web-api.js';
// import { Entry, List } from '../../../views/list.js';

// export const OpenSensor: FunctionComponent<{
//   element: OpenSensorElement;
// }> = ({ element }) => {
//   const { property } = element;

//   useSetTitleOverride(useI18nKey(property));

//   const open = useChild(element, 'open');
//   const openValue = useGetter<boolean>(open);

//   const openLastChangeDate = useDateFromEpoch(
//     useChildGetter<number>(open, 'lastChange'),
//   );
//   const openLastChangeRelative = useRelativeTimeLabel(openLastChangeDate);
//   const openLastChangeAbsolute = useAbsoluteTimeLabel(openLastChangeDate);

//   const tamperSwitch = useChild(open, 'tamperSwitch');
//   const tamperSwitchValue = useGetter<boolean>(tamperSwitch);

//   const tamperSwitchLastChangeDate = useDateFromEpoch(
//     useChildGetter<number>(tamperSwitch, 'lastChange'),
//   );
//   const tamperSwitchLastChangeRelative = useRelativeTimeLabel(
//     useDateFromEpoch(useChildGetter<number>(tamperSwitch, 'lastChange')),
//   );
//   const tamperSwitchLastChangeAbsolute = useAbsoluteTimeLabel(
//     useDateFromEpoch(useChildGetter<number>(tamperSwitch, 'lastChange')),
//   );

//   const openIsReceived = useChildGetter<boolean>(open, 'isReceivedValue');

//   return (
//     <>
//       <List>
//         <Entry label={<Translation i18nKey="state" capitalize={true} />}>
//           {useMemo(() => {
//             if (openValue === null) {
//               return <Translation i18nKey="unknown" />;
//             }

//             if (openValue) {
//               return <Translation i18nKey="open" />;
//             }

//             return <Translation i18nKey="closed" />;
//           }, [openValue])}
//         </Entry>
//         <Entry
//           label={
//             <>
//               {'\u2003'}
//               <Translation i18nKey="lastChange" />
//             </>
//           }
//         >
//           {openLastChangeDate ? (
//             <AlignRight>
//               <TabularNums>
//                 {openLastChangeAbsolute} <br />({openLastChangeRelative})
//               </TabularNums>
//             </AlignRight>
//           ) : (
//             '—'
//           )}
//         </Entry>
//       </List>
//       <List>
//         <Entry label={<Translation i18nKey="tamperSwitch" capitalize={true} />}>
//           {useMemo(
//             () =>
//               tamperSwitchValue ? <Translation i18nKey="triggered" /> : '—',
//             [tamperSwitchValue],
//           )}
//         </Entry>
//         <Entry
//           label={
//             <>
//               {'\u2003'}
//               <Translation i18nKey="lastChange" />
//             </>
//           }
//         >
//           {tamperSwitchLastChangeDate ? (
//             <AlignRight>
//               <TabularNums>
//                 {tamperSwitchLastChangeAbsolute} <br />(
//                 {tamperSwitchLastChangeRelative})
//               </TabularNums>
//             </AlignRight>
//           ) : (
//             '—'
//           )}
//         </Entry>
//       </List>
//       <List>
//         <Entry label={<Translation i18nKey="restored" />}>
//           {useMemo(
//             () =>
//               openIsReceived ? (
//                 <Translation i18nKey="no" />
//               ) : (
//                 <Translation i18nKey="yes" />
//               ),
//             [openIsReceived],
//           )}
//         </Entry>
//       </List>
//     </>
//   );
// };
