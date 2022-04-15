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
import { useElementFilter, useLevelShallow } from '../../state/web-api.js';
import { Category } from '../category.js';
import { DiagnosticsContainer } from '../../components/diagnostics.js';
import { FunctionComponent } from 'preact';
import { Hierarchy } from '../controls/diagnostics.js';
import { Translation } from '../../state/i18n.js';
import { actuated } from '../../i18n/sorting.js';
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

  const groupedSensors = useMemo(() => {
    return groupBy(sensors, 'measured');
  }, [sensors]);

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
      {groupedSensors.map(({ elements, group }) => (
        <Category header={<Translation i18nKey={group} capitalize={true} />}>
          <DiagnosticsContainer>
            {elements.map((element) => (
              <Hierarchy element={element} />
            ))}
          </DiagnosticsContainer>
        </Category>
      ))}

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
