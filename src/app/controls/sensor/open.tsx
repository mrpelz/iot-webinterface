// import { FunctionComponent } from 'preact';
// import { useCallback } from 'preact/hooks';

// import { Tag } from '../../components/controls.js';
// import { ForwardIcon } from '../../components/icons.js';
// import { I18nKey } from '../../i18n/main.js';
// import { Translation } from '../../state/i18n.js';
// import { useSegment } from '../../state/path.js';
// import { useChild, useGetter } from '../../state/web-api.js';
// import {
//   HierarchyElement,
//   HierarchyElementArea,
//   isMetaArea,
//   MetaArea,
// } from '../../web-api.js';
// import { CellWithBody } from '../main.js';
// import { BinarySensorElement, isBinarySensorElement } from './binary.js';

// export type OpenSensorElement = HierarchyElementArea & {
//   children: {
//     open: BinarySensorElement;
//   };
// };

// export const isMetaAreaDoor = ({ name }: MetaArea): boolean =>
//   ['door', 'entryDoor'].includes(name);
// export const isMetaAreaWindow = ({ name }: MetaArea): boolean =>
//   name === 'window';

// export const isOpenSensorElement = (
//   element: HierarchyElement,
// ): element is OpenSensorElement =>
//   Boolean(
//     isMetaArea(element.meta) &&
//       element.children &&
//       'open' in element.children &&
//       isBinarySensorElement(element.children.open),
//   );

// export const OpenSensor: FunctionComponent<{
//   element: OpenSensorElement;
//   negativeKey?: I18nKey;
//   onClick?: () => void;
//   positiveKey?: I18nKey;
//   title?: I18nKey;
// }> = ({
//   element,
//   negativeKey = 'closed',
//   onClick,
//   positiveKey = 'open',
//   title,
// }) => {
//   const { id, property } = element;

//   const [, setSubRouteId] = useSegment(1);

//   const handleClick = useCallback(
//     () => setSubRouteId?.(id),
//     [id, setSubRouteId],
//   );

//   const open = useChild(element, 'open') as BinarySensorElement;
//   const value = useGetter<boolean>(open);

//   return (
//     <CellWithBody
//       icon={<ForwardIcon height="1em" />}
//       onClick={onClick ?? handleClick}
//       title={<Translation i18nKey={title || property} capitalize={true} />}
//     >
//       <Tag>
//         {value === null ? (
//           '?'
//         ) : (
//           <Translation i18nKey={value ? positiveKey : negativeKey} />
//         )}
//       </Tag>
//     </CellWithBody>
//   );
// };
