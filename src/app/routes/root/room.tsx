import {
  HierarchyElement,
  HierarchyElementArea,
  HierarchyElementProperty,
  HierarchyElementPropertyActuator,
  HierarchyElementPropertySensor,
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
import { useCallback, useMemo } from 'preact/hooks';
import {
  useElementFilter,
  useElements,
  useLevelShallow,
  useMetaFilter,
} from '../../state/web-api.js';
import { Category } from '../../views/category.js';
import { Control } from '../../controls/main.js';
import { FunctionComponent } from 'preact';
import { Grid } from '../../components/grid.js';
import { SubPage } from '../sub/room/main.js';
import { SubRoute } from '../../views/route.js';
import { Translation } from '../../state/i18n.js';
import { isMetaAreaRGB } from '../../controls/actuators/rgb.js';
import { useArray } from '../../hooks/use-array-compare.js';
import { useSegment } from '../../state/path.js';

export const Room: FunctionComponent<{
  elements: HierarchyElement[];
}> = ({ children, elements: _parents }) => {
  const parents = useArray(_parents);

  const areas = useLevelShallow<HierarchyElementArea>(Levels.AREA, parents);

  const doors = useMetaFilter(areas, isMetaAreaDoor);
  const windows = useMetaFilter(areas, isMetaAreaWindow);
  const RGBs = useMetaFilter(areas, isMetaAreaRGB);

  const properties = useLevelShallow<HierarchyElementProperty>(
    Levels.PROPERTY,
    parents
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

  const elements = useElements();

  const [subRouteId] = useSegment(1);
  const [subRouteElement] = useElementFilter(
    subRouteId ? elements : null,
    useCallback(({ id }) => id === subRouteId, [subRouteId])
  );

  return (
    <SubRoute
      subRoute={subRouteElement ? <SubPage element={subRouteElement} /> : null}
    >
      {children}
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

      {listedActuators.map(({ elements: _elements, group }) => (
        <Category header={<Translation i18nKey={group} capitalize={true} />}>
          <Grid>
            {_elements.map((element) => (
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
