// import { StyledVNode } from 'goober';
// import { FunctionComponent } from 'preact';
// import {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'preact/hooks';

// import { BlendOver } from '../../components/blend-over.js';
// import { ColorIcon } from '../../components/icons.js';
// import {
//   BodyDisableRoundedCorners,
//   ColorLabel,
//   RGBBody,
// } from '../../components/rgb-actuator.js';
// import { useColorBody } from '../../hooks/use-color-body.js';
// import { useColorPicker } from '../../hooks/use-color-picker.js';
// import { useDelay } from '../../hooks/use-delay.js';
// import { useSwipe } from '../../hooks/use-swipe.js';
// import { useWheel } from '../../hooks/use-wheel.js';
// import { I18nKey } from '../../i18n/main.js';
// import { Translation } from '../../state/i18n.js';
// import { useSegment } from '../../state/path.js';
// import {
//   useChild,
//   useChildGetter,
//   useChildSetter,
//   useGetter,
// } from '../../state/web-api.js';
// import {
//   HierarchyElement,
//   HierarchyElementArea,
//   isMetaArea,
//   MetaArea,
// } from '../../web-api.js';
// import { Cell } from '../main.js';
// import {
//   BrightnessActuatorElement,
//   BrightnessLabel,
//   isBrightnessActuatorElement,
//   useSwipeBrightness,
//   useWheelBrightness,
// } from './brightness.js';

// export type RGBActuatorElement = HierarchyElementArea & {
//   children: Record<'r' | 'g' | 'b', BrightnessActuatorElement>;
// };

// export const isMetaAreaRGB = ({ name }: MetaArea): boolean =>
//   name.toLowerCase().includes('rgb');

// export const isRGBActuatorElement = (
//   element: HierarchyElement,
// ): element is RGBActuatorElement =>
//   Boolean(
//     isMetaArea(element.meta) &&
//       element.children &&
//       'r' in element.children &&
//       isBrightnessActuatorElement(element.children.r) &&
//       'g' in element.children &&
//       isBrightnessActuatorElement(element.children.g) &&
//       'b' in element.children &&
//       isBrightnessActuatorElement(element.children.b),
//   );

// const Color: FunctionComponent<{
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   base?: StyledVNode<any>;
//   element: BrightnessActuatorElement;
// }> = ({
//   // eslint-disable-next-line @typescript-eslint/naming-convention
//   base: Base = RGBBody,
//   element,
// }) => {
//   const {
//     meta: { actuated },
//     property,
//   } = element;

//   const value = useGetter<boolean>(element);

//   const brightness = useChildGetter<number>(element, 'brightness');
//   const brightnessRef = useRef(brightness);
//   useEffect(() => {
//     brightnessRef.current = brightness;
//   }, [brightness]);

//   const loading = useChildGetter<boolean>(element, 'loading');
//   const loadingRef = useRef(loading);
//   useEffect(() => {
//     loadingRef.current = loading;
//   }, [loading]);

//   const flip = useChildSetter<null>(element, 'flip');
//   const handleClick = useCallback(
//     (event: MouseEvent) => {
//       event.stopPropagation();
//       flip?.(null);
//     },
//     [flip],
//   );

//   const setBrightness = useChildSetter<number>(element, 'brightness');

//   const [isInteracting, setInteracting] = useState(false);

//   const handleWheel = useWheelBrightness(
//     brightnessRef,
//     loadingRef,
//     setBrightness,
//   );
//   const handleSwipe = useSwipeBrightness(
//     brightnessRef,
//     loadingRef,
//     setBrightness,
//     setInteracting,
//   );

//   const refA = useRef<HTMLElement | null>(null);
//   const refB = useRef<HTMLElement | null>(null);

//   useWheel(refA, handleWheel, 100);
//   useWheel(refB, handleWheel, 100);

//   useSwipe(refA, handleSwipe, 50);
//   useSwipe(refB, handleSwipe, 50);

//   const ColorBody = useColorBody(Base, property, actuated);

//   const [route] = useSegment(0);
//   const allowTransition = Boolean(useDelay(route, 300, true));

//   const label = useMemo(
//     () => (
//       <>
//         <ColorLabel>
//           <Translation i18nKey={property} />
//         </ColorLabel>
//         <BrightnessLabel
//           brightness={brightness}
//           loading={loading}
//           value={value}
//         />
//       </>
//     ),
//     [brightness, loading, property, value],
//   );

//   return (
//     <BlendOver
//       blendOver={brightness === null ? 0 : brightness}
//       transition={
//         allowTransition && brightness !== null && !loading && !isInteracting
//       }
//       overlay={
//         <ColorBody onClick={handleClick} ref={refA}>
//           {label}
//         </ColorBody>
//       }
//     >
//       <Base onClick={handleClick} ref={refB}>
//         {label}
//       </Base>
//     </BlendOver>
//   );
// };

// export const RGBActuator: FunctionComponent<{
//   element: RGBActuatorElement;
//   onClick?: () => void;
//   title?: I18nKey;
// }> = ({ element, onClick, title }) => {
//   const { property } = element;

//   const r = useChild(element, 'r') as BrightnessActuatorElement | null;
//   const g = useChild(element, 'g') as BrightnessActuatorElement | null;
//   const b = useChild(element, 'b') as BrightnessActuatorElement | null;

//   const rBrightness = useChildGetter<number>(r, 'brightness');
//   const rSetBrightness = useChildSetter<number>(r, 'brightness');

//   const gBrightness = useChildGetter<number>(g, 'brightness');
//   const gSetBrightness = useChildSetter<number>(g, 'brightness');

//   const bBrightness = useChildGetter<number>(b, 'brightness');
//   const bSetBrightness = useChildSetter<number>(b, 'brightness');

//   const [focus, colorPicker] = useColorPicker(
//     useMemo(() => [rBrightness, rSetBrightness], [rBrightness, rSetBrightness]),
//     useMemo(() => [gBrightness, gSetBrightness], [gBrightness, gSetBrightness]),
//     useMemo(() => [bBrightness, bSetBrightness], [bBrightness, bSetBrightness]),
//   );

//   if (!r || !g || !b) return null;

//   return (
//     <Cell
//       icon={<ColorIcon height="1em" />}
//       onClick={onClick || focus}
//       title={
//         <>
//           {colorPicker}
//           <Translation i18nKey={title || property} capitalize={true} />
//         </>
//       }
//     >
//       <Color base={BodyDisableRoundedCorners} element={r} />
//       <Color base={BodyDisableRoundedCorners} element={g} />
//       <Color element={b} />
//     </Cell>
//   );
// };
