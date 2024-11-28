// import { ComponentChildren, FunctionComponent, JSX } from 'preact';
// import { useEffect, useMemo, useRef, useState } from 'preact/hooks';

// import { Summary } from '../components/diagnostics.js';
// import { $i18n } from '../state/translation.js';
// import { useGetter, useSetter } from '../state/web-api.js';
// import { getSignal } from '../util/signal.js';
// import {
//   HierarchyElement,
//   isElementWithMeta,
//   isMetaPropertyActuator,
//   isMetaPropertySensorDate,
//   Levels,
//   levelToString,
//   ParentRelation,
//   parentRelationToString,
//   typeToValueType,
//   ValueType,
//   valueTypeToType,
// } from '../web-api.js';

// export const Details: FunctionComponent<{
//   open?: boolean;
//   summary: ComponentChildren;
// }> = ({ children, open, summary }) => {
//   const ref = useRef<HTMLDetailsElement>(null);
//   const [isOpen, setIsOpen] = useState(Boolean(open));

//   useEffect(() => {
//     const { current: element } = ref;

//     const fn = () => {
//       if (!element) return;
//       setIsOpen(element.open);
//     };

//     element?.addEventListener('toggle', fn);
//     return () => element?.removeEventListener('toggle', fn);
//   }, []);

//   return (
//     <details open={isOpen} ref={ref}>
//       <Summary>{summary}</Summary>
//       {isOpen ? children : null}
//     </details>
//   );
// };

// export const Meta: FunctionComponent<{ element: HierarchyElement }> = ({
//   element,
// }) => {
//   const { country } = getSignal($i18n);

//   if (!isElementWithMeta(element)) return null;

//   const { id, meta, property } = element;

//   if (Object.keys(meta).length === 0) return null;

//   return (
//     <>
//       <tr>
//         <td>
//           <b>ID</b>
//         </td>
//         <td>{id}</td>
//       </tr>
//       <tr>
//         <td>
//           <b>Property</b>
//         </td>
//         <td>{property}</td>
//       </tr>
//       <tr>
//         <td>
//           <b>Meta</b>
//         </td>
//         <td>
//           <table>
//             {Object.entries(meta).map(([key, value]) => {
//               const idDate =
//                 key === 'id' && meta.level === Levels.SYSTEM && country
//                   ? new Date(Number(value)).toLocaleString(country)
//                   : null;

//               const level =
//                 key === 'level'
//                   ? levelToString(value as unknown as Levels)
//                   : null;

//               const parentRelation =
//                 key === 'parentRelation'
//                   ? parentRelationToString(value as unknown as ParentRelation)
//                   : null;

//               const valueType =
//                 key === 'valueType'
//                   ? valueTypeToType(value as unknown as ValueType)
//                   : null;

//               return (
//                 <tr>
//                   <td>{key}</td>
//                   <td>
//                     {level ||
//                       parentRelation ||
//                       valueType ||
//                       JSON.stringify(value)}{' '}
//                     {idDate ? <>({idDate})</> : null}
//                   </td>
//                 </tr>
//               );
//             })}
//           </table>
//         </td>
//       </tr>
//     </>
//   );
// };

// const Getter: FunctionComponent<{ element: HierarchyElement }> = ({
//   element,
// }) => {
//   const { get, meta } = element;
//   const isDate = isMetaPropertySensorDate(meta);

//   const { country } = getSignal($i18n);

//   const rawState = useGetter<unknown>(element);
//   const state = useMemo(
//     () =>
//       isDate && country && rawState
//         ? new Date(rawState as number).toLocaleString(country)
//         : JSON.stringify(rawState, undefined, 2),
//     [isDate, country, rawState],
//   );

//   if (get === undefined) return null;

//   return (
//     <tr>
//       <td>
//         <b>Getter</b> <i>{get}</i>
//       </td>
//       <td>
//         <pre>{state}</pre>
//       </td>
//     </tr>
//   );
// };

// const Setter: FunctionComponent<{ element: HierarchyElement }> = ({
//   element,
// }) => {
//   const { meta, set } = element;

//   const setter = useSetter<unknown>(element);
//   const [input, setInput] = useState<unknown>(undefined);

//   if (set === undefined || !isMetaPropertyActuator(meta)) return null;

//   const { valueType } = meta;
//   const isNull = valueType === ValueType.NULL;
//   const namedValueType = valueTypeToType(valueType);

//   const onChange: JSX.EventHandler<
//     JSX.TargetedEvent<HTMLInputElement, Event>
//   > = ({ currentTarget }) => {
//     const { value } = currentTarget;

//     if (value.length === 0) {
//       currentTarget.setCustomValidity('');
//       setInput(undefined);

//       return;
//     }

//     try {
//       const parsedValue = JSON.parse(value);
//       const inputType = typeToValueType(parsedValue);
//       const namedInputType = valueTypeToType(inputType);

//       if (inputType !== valueType) {
//         currentTarget.setCustomValidity(
//           `parsed type does not match the required type! Needed: ${namedValueType}, parsed: ${namedInputType}`,
//         );

//         return;
//       }

//       currentTarget.setCustomValidity('');
//       setInput(parsedValue);
//     } catch {
//       currentTarget.setCustomValidity('invalid input');
//     }
//   };

//   const onSubmit: JSX.GenericEventHandler<HTMLFormElement> = (event) => {
//     event.preventDefault();

//     if (input === undefined) return;

//     setter?.(input);
//   };

//   if (set === undefined) return null;

//   return (
//     <tr>
//       <td>
//         <b>Setter</b> <i>{set}</i>
//       </td>
//       <td>
//         {isNull ? (
//           <button onClick={() => setter?.(null)}>null</button>
//         ) : (
//           <form action="#" onSubmit={onSubmit}>
//             <input placeholder={namedValueType} onChange={onChange} />
//           </form>
//         )}
//       </td>
//     </tr>
//   );
// };

// const Child: FunctionComponent<{
//   element: HierarchyElement;
//   name: string;
//   open: boolean;
// }> = ({ name, element, open }) => {
//   const { get, children, set } = element;
//   if (get === undefined && !children && set === undefined) return null;

//   return (
//     <tr>
//       <td colSpan={999}>
//         <Details
//           open={open}
//           summary={
//             <>
//               <b>Child:</b> {name}
//             </>
//           }
//         >
//           {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
//           <Hierarchy element={element} />
//         </Details>
//       </td>
//     </tr>
//   );
// };

// export const Hierarchy: FunctionComponent<{ element: HierarchyElement }> = ({
//   element,
// }) => {
//   const { children: hierarchyChildren } = element;

//   const openChildList = useMemo(() => {
//     const { meta: { level = undefined } = {} } = element ?? {};
//     if (level === undefined) return false;

//     return (
//       level === Levels.SYSTEM ||
//       level === Levels.HOME ||
//       level === Levels.BUILDING
//     );
//   }, [element]);

//   return (
//     <table>
//       <Meta element={element} />
//       <Getter element={element} />
//       <Setter element={element} />
//       {hierarchyChildren
//         ? Object.entries(hierarchyChildren).map(([name, child]) => (
//             <Child name={name} element={child} open={openChildList} />
//           ))
//         : null}
//     </table>
//   );
// };
// eslint-disable-next-line unicorn/no-empty-file
