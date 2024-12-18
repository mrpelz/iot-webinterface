// /* eslint-disable @typescript-eslint/ban-ts-comment */
// import { any, Level } from '@iot/iot-monolith/tree';
// import { FunctionComponent } from 'preact';
// import { useMemo } from 'preact/hooks';

// import { groupBy, LevelObject, sortBy } from '../../api.js';
// import { Grid } from '../../components/grid.js';
// // import { Control } from '../../controls/main.js';
// import { actuated, measuredCategories } from '../../i18n/mapping.js';
// import { useMatch } from '../../state/api.js';
// import { Translation } from '../../state/i18n.js';
// import { useSegment } from '../../state/path.js';
// import { Category } from '../../views/category.js';
// import { SubRoute } from '../../views/route.js';
// // import { SubPage } from '../sub/room/main.js';

// export const Room: FunctionComponent<{
//   // @ts-ignore
//   room: LevelObject[Level.ROOM];
// }> = ({ children, room }) => {
//   const doors = useMatch({ $: 'door' as const }, room);
//   const windows = useMatch({ $: 'window' as const }, room);
//   const properties = useMatch(
//     { level: Level.PROPERTY as const, topic: any },
//     room,
//   );

//   const securitySensors = useMemo(
//     () =>
//       sortBy(properties, 'topic', measuredCategories.security).listedResults,
//     [properties],
//   );

//   const airQualitySensors = useMemo(
//     () =>
//       sortBy(properties, 'topic', measuredCategories.airQuality).listedResults,
//     [properties],
//   );

//   const airSafetySensors = useMemo(
//     () =>
//       sortBy(properties, 'topic', measuredCategories.airSafety).listedResults,
//     [properties],
//   );

//   const environmentalSensors = useMemo(
//     () =>
//       sortBy(properties, 'topic', measuredCategories.environmental)
//         .listedResults,
//     [properties],
//   );

//   const [listedActuators, unlistedActuators] = useMemo(() => {
//     const { listedResults, unlistedResults } = sortBy(
//       properties,
//       'topic',
//       actuated,
//     );

//     return [groupBy(listedResults, 'topic'), unlistedResults] as const;
//   }, [properties]);

//   const [subRouteId] = useSegment(1);
//   const [subRouteElement] = useMatch({ $id: subRouteId }, properties);

//   return null;

//   // return (
//   //   <SubRoute
//   //     subRoute={subRouteElement ? <SubPage element={subRouteElement} /> : null}
//   //   >
//   //     {children}
//   //     {[securitySensors, doors, windows].flat().length > 0 ? (
//   //       <Category header={<Translation i18nKey="security" capitalize={true} />}>
//   //         <Grid>
//   //           {securitySensors.map((element) => (
//   //             <Control element={element} />
//   //           ))}
//   //           {doors.map((element) => (
//   //             <Control element={element} />
//   //           ))}
//   //           {windows.map((element) => (
//   //             <Control element={element} />
//   //           ))}
//   //         </Grid>
//   //       </Category>
//   //     ) : null}
//   //     {airQualitySensors.length > 0 ? (
//   //       <Category
//   //         header={<Translation i18nKey="airQuality" capitalize={true} />}
//   //       >
//   //         <Grid>
//   //           {airQualitySensors.map((element) => (
//   //             <Control element={element} />
//   //           ))}
//   //         </Grid>
//   //       </Category>
//   //     ) : null}
//   //     {airSafetySensors.length > 0 ? (
//   //       <Category
//   //         header={<Translation i18nKey="airSafety" capitalize={true} />}
//   //       >
//   //         <Grid>
//   //           {airSafetySensors.map((element) => (
//   //             <Control element={element} />
//   //           ))}
//   //         </Grid>
//   //       </Category>
//   //     ) : null}
//   //     {environmentalSensors.length > 0 ? (
//   //       <Category
//   //         header={<Translation i18nKey="environmental" capitalize={true} />}
//   //       >
//   //         <Grid>
//   //           {environmentalSensors.map((element) => (
//   //             <Control element={element} />
//   //           ))}
//   //         </Grid>
//   //       </Category>
//   //     ) : null}

//   //     {listedActuators.map(({ elements: _elements, group }) => (
//   //       <Category header={<Translation i18nKey={group} capitalize={true} />}>
//   //         <Grid>
//   //           {_elements.map((element) => (
//   //             <Control element={element} />
//   //           ))}
//   //           {group === 'lighting'
//   //             ? RGBs.map((element) => <Control element={element} />)
//   //             : null}
//   //         </Grid>
//   //       </Category>
//   //     ))}

//   //     {unlistedActuators.length > 0 ? (
//   //       <Category header={<Translation i18nKey="other" capitalize={true} />}>
//   //         <Grid>
//   //           {unlistedActuators.map((element) => (
//   //             <Control element={element} />
//   //           ))}
//   //         </Grid>
//   //       </Category>
//   //     ) : null}
//   //   </SubRoute>
//   // );
// };
