/* eslint-disable unicorn/no-empty-file */
// import { FunctionComponent } from 'preact';

// import { Tag } from '../../components/controls.js';
// import { I18nKey } from '../../i18n/main.js';
// import { Translation } from '../../state/i18n.js';
// import { useGetter } from '../../state/web-api.js';
// import {
//   HierarchyElement,
//   HierarchyElementPropertySensor,
//   isMetaPropertySensor,
//   ValueType,
// } from '../../web-api.js';
// import { CellWithBody } from '../main.js';

// export type BinarySensorElement = HierarchyElementPropertySensor & {
//   meta: { valueType: ValueType.BOOLEAN };
// };

// export const isBinarySensorElement = (
//   element: HierarchyElement,
// ): element is BinarySensorElement =>
//   isMetaPropertySensor(element.meta) &&
//   element.meta.valueType === ValueType.BOOLEAN;

// export const BinarySensor: FunctionComponent<{
//   element: BinarySensorElement;
//   negativeKey?: I18nKey;
//   onClick?: () => void;
//   positiveKey?: I18nKey;
//   title?: I18nKey;
// }> = ({ element, negativeKey = 'no', onClick, positiveKey = 'yes', title }) => {
//   const { property } = element;

//   const value = useGetter<boolean>(element);

//   return (
//     <CellWithBody
//       onClick={onClick}
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
