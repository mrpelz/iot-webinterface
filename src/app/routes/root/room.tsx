import {
  HierarchyElementArea,
  HierarchyElementProperty,
  HierarchyElementPropertyActuator,
  HierarchyElementPropertySensor,
  HierarchyElementRoom,
  Levels,
  groupBy,
  isMetaPropertyActuator,
  isMetaPropertySensor,
  sortBy,
} from '../../web-api.js';
import { actuated, measuredCategories } from '../../i18n/mapping.js';
import {
  isMetaAreaDoor,
  isMetaAreaWindow,
} from '../../controls/sensor/open.js';
import { useLevelShallow, useMetaFilter } from '../../state/web-api.js';
import { Category } from '../../views/category.js';
import { Control } from '../../controls/main.js';
import { FunctionComponent } from 'preact';
import { Grid } from '../../components/grid.js';
import { SubRoute } from '../../views/route.js';
import { Translation } from '../../state/i18n.js';
import { isMetaAreaRGB } from '../../controls/actuators/rgb.js';
import { useMemo } from 'preact/hooks';

export const Room: FunctionComponent<{
  element: HierarchyElementRoom;
}> = ({ element: room }) => {
  const areas = useLevelShallow<HierarchyElementArea>(Levels.AREA, room);

  const doors = useMetaFilter(areas, isMetaAreaDoor);
  const windows = useMetaFilter(areas, isMetaAreaWindow);
  const RGBs = useMetaFilter(areas, isMetaAreaRGB);

  const properties = useLevelShallow<HierarchyElementProperty>(
    Levels.PROPERTY,
    room
  );

  const sensors = useMetaFilter<
    HierarchyElementProperty,
    HierarchyElementPropertySensor
  >(properties, isMetaPropertySensor);

  const securitySensors = useMemo(
    () =>
      sortBy(sensors, 'measured', measuredCategories.security).listedResults,
    [sensors]
  );

  const airQualitySensors = useMemo(
    () =>
      sortBy(sensors, 'measured', measuredCategories.airQuality).listedResults,
    [sensors]
  );

  const airSafetySensors = useMemo(
    () =>
      sortBy(sensors, 'measured', measuredCategories.airSafety).listedResults,
    [sensors]
  );

  const environmentalSensors = useMemo(
    () =>
      sortBy(sensors, 'measured', measuredCategories.environmental)
        .listedResults,
    [sensors]
  );

  const actuators = useMetaFilter<
    HierarchyElementProperty,
    HierarchyElementPropertyActuator
  >(properties, isMetaPropertyActuator);

  const [listedActuators, unlistedActuators] = useMemo(() => {
    const { listedResults, unlistedResults } = sortBy(
      actuators,
      'actuated',
      actuated
    );

    return [groupBy(listedResults, 'actuated'), unlistedResults] as const;
  }, [actuators]);

  return (
    <SubRoute subRoute={null}>
      {[securitySensors, doors, windows].flat().length ? (
        <Category header={<Translation i18nKey="security" capitalize={true} />}>
          <Grid>
            {securitySensors.map((element) => (
              <Control element={element} />
            ))}
            {doors.map((element) => (
              <Control element={element} />
            ))}
            {windows.map((element) => (
              <Control element={element} />
            ))}
          </Grid>
        </Category>
      ) : null}
      {airQualitySensors.length ? (
        <Category
          header={<Translation i18nKey="airQuality" capitalize={true} />}
        >
          <Grid>
            {airQualitySensors.map((element) => (
              <Control element={element} />
            ))}
          </Grid>
        </Category>
      ) : null}
      {airSafetySensors.length ? (
        <Category
          header={<Translation i18nKey="airSafety" capitalize={true} />}
        >
          <Grid>
            {airSafetySensors.map((element) => (
              <Control element={element} />
            ))}
          </Grid>
        </Category>
      ) : null}
      {environmentalSensors.length ? (
        <Category
          header={<Translation i18nKey="environmental" capitalize={true} />}
        >
          <Grid>
            {environmentalSensors.map((element) => (
              <Control element={element} />
            ))}
          </Grid>
        </Category>
      ) : null}

      {listedActuators.map(({ elements, group }) => (
        <Category header={<Translation i18nKey={group} capitalize={true} />}>
          <Grid>
            {elements.map((element) => (
              <Control element={element} />
            ))}
            {group === 'lighting'
              ? RGBs.map((element) => <Control element={element} />)
              : null}
          </Grid>
        </Category>
      ))}

      {unlistedActuators.length ? (
        <Category header={<Translation i18nKey="other" capitalize={true} />}>
          <Grid>
            {unlistedActuators.map((element) => (
              <Control element={element} />
            ))}
          </Grid>
        </Category>
      ) : null}
    </SubRoute>
  );
};
