// import { FunctionComponent } from 'preact';
// import { useCallback, useMemo } from 'preact/hooks';

// import { BlendOver } from '../components/blend-over.js';
// import { BodyLarge } from '../components/controls.js';
// import { TabularNums } from '../components/text.js';
// import { useColorBody } from '../hooks/use-color-body.js';
// import { useDelay } from '../hooks/use-delay.js';
// import {
//   useDateFromEpoch,
//   useTimeLabel,
//   useTimeSpan,
// } from '../hooks/use-time-label.js';
// import { I18nKey } from '../i18n/main.js';
// import { Translation } from '../state/i18n.js';
// import { useSegment } from '../state/path.js';
// import {
//   useChild,
//   useChildGetter,
//   useChildSetter,
//   useGetter,
// } from '../state/web-api.js';
// import {
//   HierarchyElement,
//   isMetaPropertySensorDate,
//   MetaPropertySensorDate,
// } from '../web-api.js';
// import {
//   BinaryActuatorElement,
//   isBinaryActuatorElement,
// } from './actuators/binary.js';
// import {
//   isNullActuatorElement,
//   NullActuatorElement,
// } from './actuators/null.js';
// import { Cell } from './main.js';

// export type TimerActuatorElement = BinaryActuatorElement & {
//   children: {
//     active: BinaryActuatorElement & {
//       children: {
//         cancel: NullActuatorElement;
//         reset: NullActuatorElement;
//       };
//     };
//     flip: NullActuatorElement;
//     runoutTime: MetaPropertySensorDate;
//     triggerTime: MetaPropertySensorDate;
//   };
// };

// export const isTimerActuatorElement = (
//   element: HierarchyElement,
// ): element is TimerActuatorElement =>
//   Boolean(
//     isBinaryActuatorElement(element) &&
//       element.children &&
//       'active' in element.children &&
//       isBinaryActuatorElement(element.children.active) &&
//       element.children.active.children &&
//       'cancel' in element.children.active.children &&
//       isNullActuatorElement(element.children.active.children.cancel) &&
//       'reset' in element.children.active.children &&
//       isNullActuatorElement(element.children.active.children.reset) &&
//       'flip' in element.children &&
//       isNullActuatorElement(element.children.flip) &&
//       'runoutTime' in element.children &&
//       isMetaPropertySensorDate(element.children.runoutTime.meta) &&
//       'triggerTime' in element.children &&
//       isMetaPropertySensorDate(element.children.triggerTime.meta),
//   );

// export const TimerActuator: FunctionComponent<{
//   element: TimerActuatorElement;
//   onClick?: () => void;
//   title?: I18nKey;
// }> = ({ element, onClick, title }) => {
//   const {
//     property,
//     meta: { actuated },
//   } = element;

//   const enabledValue = useGetter<boolean>(element);

//   const active = useChild(element, 'active');
//   const activeValue = useGetter<boolean>(active);

//   const runoutTimeDate = useDateFromEpoch(
//     useChildGetter<number>(activeValue ? element : null, 'runoutTime'),
//   );
//   const runoutTimeLabel = useTimeLabel(runoutTimeDate, 0);

//   const [, fraction] = useTimeSpan(
//     useDateFromEpoch(
//       useChildGetter<number>(activeValue ? element : null, 'triggerTime'),
//     ),
//     runoutTimeDate,
//   );

//   const flip = useChildSetter<null>(element, 'flip');
//   const cancel = useChildSetter<null>(active, 'cancel');

//   const handleClick = useCallback(() => {
//     if (activeValue) {
//       cancel?.(null);
//       return;
//     }

//     flip?.(null);
//   }, [activeValue, cancel, flip]);

//   const ColorBody = useColorBody(BodyLarge, property, actuated);

//   const [route] = useSegment(0);
//   const allowTransition = Boolean(useDelay(route, 300, true));

//   const label = useMemo(() => {
//     if (!activeValue || !runoutTimeLabel) {
//       return null;
//     }

//     return <TabularNums>{runoutTimeLabel}</TabularNums>;
//   }, [activeValue, runoutTimeLabel]);

//   const blendOver = useMemo(() => {
//     if (activeValue && fraction !== null) return fraction;
//     if (enabledValue) return 0;
//     return 1;
//   }, [activeValue, enabledValue, fraction]);

//   const hasJustFinished =
//     (useDelay(activeValue, 1000) && !activeValue) || (activeValue && !label);

//   return (
//     <Cell
//       onClick={flip && !onClick ? handleClick : onClick}
//       title={<Translation i18nKey={title || property} capitalize={true} />}
//     >
//       <BlendOver
//         blendOver={blendOver}
//         invert={true}
//         transition={allowTransition && activeValue !== null}
//         transitionDurationOverride={activeValue ? 1000 : 300}
//         overlay={
//           enabledValue === null ? undefined : (
//             <ColorBody>{label || <Translation i18nKey="on" />}</ColorBody>
//           )
//         }
//       >
//         <BodyLarge>
//           {hasJustFinished ? (
//             <Translation i18nKey="finished" />
//           ) : (
//             label || <Translation i18nKey="off" />
//           )}
//         </BodyLarge>
//       </BlendOver>
//     </Cell>
//   );
// };
