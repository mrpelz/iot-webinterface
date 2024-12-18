// import { FunctionComponent } from 'preact';
// import { useCallback, useRef } from 'preact/hooks';

// import { Body } from '../../components/controls.js';
// import { Button } from '../../components/list.js';
// import { TriggerBody } from '../../components/null-actuator.js';
// import { Overlay } from '../../components/overlay.js';
// import { useColorBody } from '../../hooks/use-color-body.js';
// import { I18nKey } from '../../i18n/main.js';
// import { Translation } from '../../state/i18n.js';
// import { useSetter } from '../../state/web-api.js';
// import {
//   HierarchyElement,
//   HierarchyElementPropertyActuator,
//   isMetaPropertyActuator,
//   ValueType,
// } from '../../web-api.js';
// import { Cell } from '../main.js';

// export type NullActuatorElement = HierarchyElementPropertyActuator & {
//   meta: { valueType: ValueType.NULL };
// };

// export const isNullActuatorElement = (
//   element: HierarchyElement,
// ): element is NullActuatorElement =>
//   isMetaPropertyActuator(element.meta) &&
//   element.meta.valueType === ValueType.NULL;

// export const NullActuator: FunctionComponent<{
//   element: NullActuatorElement;
//   onClick?: () => void;
//   title?: I18nKey;
// }> = ({ element, onClick, title }) => {
//   const {
//     property,
//     meta: { actuated },
//   } = element;

//   const setter = useSetter<null>(element);

//   const overlayRef = useRef<HTMLElement>(null);
//   const baseRef = useRef<HTMLElement>(null);

//   const handleClick = useCallback(() => {
//     const { current: overlay } = overlayRef;
//     const { current: base } = baseRef;

//     setter?.(null);

//     if (!(overlay instanceof HTMLElement)) return;
//     if (!(base instanceof HTMLElement)) return;

//     (async () => {
//       const [animationBase, animationOverlay] = await Promise.all([
//         base.animate([{ opacity: 0 }, { opacity: 1 }], {
//           duration: 1000,
//           easing: 'ease-out',
//         }).finished,
//         overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
//           duration: 1000,
//           easing: 'ease-out',
//         }).finished,
//       ]);

//       animationBase.finish();
//       animationOverlay.finish();
//     })();
//   }, [setter]);

//   const ColorBody = useColorBody(TriggerBody, property, actuated);

//   return (
//     <Cell
//       onClick={setter && !onClick ? handleClick : onClick}
//       title={<Translation i18nKey="scene" capitalize={true} />}
//     >
//       <Overlay
//         overlay={
//           <ColorBody ref={overlayRef}>
//             <Translation i18nKey="triggered" />
//           </ColorBody>
//         }
//       >
//         <Body ref={baseRef}>
//           <Translation i18nKey={title || property} capitalize={true} />
//         </Body>
//       </Overlay>
//     </Cell>
//   );
// };

// export const NullActuatorButton: FunctionComponent<{
//   element: NullActuatorElement;
// }> = ({ element, children }) => {
//   const setter = useSetter<null>(element);
//   const handleClick = useCallback(() => setter?.(null), [setter]);

//   return <Button onClick={handleClick}>{children}</Button>;
// };
