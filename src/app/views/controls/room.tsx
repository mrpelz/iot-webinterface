import {
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
import { actuated, measuredCategories } from '../../i18n/sorting.js';
import { useElementFilter, useLevelShallow } from '../../state/web-api.js';
import { Category } from '../category.js';
import { DiagnosticsContainer } from '../../components/diagnostics.js';
import { FunctionComponent } from 'preact';
import { Hierarchy } from '../controls/diagnostics.js';
import { Translation } from '../../state/i18n.js';
import { useMemo } from 'preact/hooks';

export const Room: FunctionComponent<{
  element: HierarchyElementRoom;
}> = ({ element: room }) => {
  const properties = useLevelShallow<HierarchyElementProperty>(
    Levels.PROPERTY,
    room
  );

  const sensors = useElementFilter<
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

  const actuators = useElementFilter<
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
    <>
      {securitySensors.length ? (
        <Category header={<Translation i18nKey="security" capitalize={true} />}>
          <DiagnosticsContainer>
            {securitySensors.map((element) => (
              <Hierarchy element={element} />
            ))}
          </DiagnosticsContainer>
        </Category>
      ) : null}
      {airQualitySensors.length ? (
        <Category
          header={<Translation i18nKey="airQuality" capitalize={true} />}
        >
          <DiagnosticsContainer>
            {airQualitySensors.map((element) => (
              <Hierarchy element={element} />
            ))}
          </DiagnosticsContainer>
        </Category>
      ) : null}
      {airSafetySensors.length ? (
        <Category
          header={<Translation i18nKey="airSafety" capitalize={true} />}
        >
          <DiagnosticsContainer>
            {airSafetySensors.map((element) => (
              <Hierarchy element={element} />
            ))}
          </DiagnosticsContainer>
        </Category>
      ) : null}
      {environmentalSensors.length ? (
        <Category
          header={<Translation i18nKey="environmental" capitalize={true} />}
        >
          <DiagnosticsContainer>
            {environmentalSensors.map((element) => (
              <Hierarchy element={element} />
            ))}
          </DiagnosticsContainer>
        </Category>
      ) : null}

      {listedActuators.map(({ elements, group }) => (
        <Category header={<Translation i18nKey={group} capitalize={true} />}>
          <DiagnosticsContainer>
            {elements.map((element) => (
              <Hierarchy element={element} />
            ))}
          </DiagnosticsContainer>
        </Category>
      ))}

      {unlistedActuators.length ? (
        <Category header={<Translation i18nKey="other" capitalize={true} />}>
          <DiagnosticsContainer>
            {unlistedActuators.map((element) => (
              <Hierarchy element={element} />
            ))}
          </DiagnosticsContainer>
        </Category>
      ) : null}
    </>
  );
};
