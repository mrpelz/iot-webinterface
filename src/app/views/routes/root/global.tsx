import {
  HierarchyElementFloor,
  HierarchyElementProperty,
  HierarchyElementPropertyActuator,
  HierarchyElementPropertySensor,
  HierarchyElementRoom,
  Levels,
  groupBy,
  isMetaPropertyActuator,
  sortBy,
} from '../../../web-api.js';
import { useCallback, useMemo } from 'preact/hooks';
import {
  useChild,
  useElementFilter,
  useHierarchy,
  useLevelDeep,
  useLevelShallow,
} from '../../../state/web-api.js';
import { Category } from '../../category.js';
import { DiagnosticsContainer } from '../../../components/diagnostics.js';
import { FunctionComponent } from 'preact';
import { Hierarchy } from '../../controls/diagnostics.js';
import { Translation } from '../../../state/i18n.js';
import { actuated } from '../../../i18n/sorting.js';
import { useNavigationBuilding } from '../../../state/navigation.js';

export const Global: FunctionComponent = () => {
  const hierarchy = useHierarchy();
  const [building] = useNavigationBuilding();

  const globalProperties = useLevelShallow<HierarchyElementProperty>(
    Levels.PROPERTY,
    hierarchy
  );
  const firstFloorProperties = useLevelShallow<HierarchyElementProperty>(
    Levels.PROPERTY,
    ...useElementFilter(
      useLevelShallow<HierarchyElementFloor>(Levels.FLOOR, building),
      useCallback(({ name }) => name === 'firstFloor', [])
    )
  );
  const [hallway] = useElementFilter(
    useLevelDeep<HierarchyElementRoom>(Levels.ROOM, hierarchy),
    useCallback(({ name }) => name === 'hallway', [])
  );

  const entryDoor = useChild(
    hallway,
    'doorOpen'
  ) as HierarchyElementPropertySensor;

  const actuators = useElementFilter<
    HierarchyElementProperty,
    HierarchyElementPropertyActuator
  >(
    useMemo(
      () => [globalProperties, firstFloorProperties].flat(1),
      [firstFloorProperties, globalProperties]
    ),
    isMetaPropertyActuator
  );

  const [listed, unlisted] = useMemo(() => {
    const { listedResults, unlistedResults } = sortBy(
      actuators,
      'actuated',
      actuated
    );

    return [groupBy(listedResults, 'actuated'), unlistedResults] as const;
  }, [actuators]);

  return (
    <>
      {entryDoor ? (
        <Category header={<Translation i18nKey="security" capitalize={true} />}>
          <DiagnosticsContainer>
            <Hierarchy element={entryDoor} />
          </DiagnosticsContainer>
        </Category>
      ) : null}

      {listed.map(({ elements, group }) => (
        <Category header={<Translation i18nKey={group} capitalize={true} />}>
          <DiagnosticsContainer>
            {elements.map((element) => (
              <Hierarchy element={element} />
            ))}
          </DiagnosticsContainer>
        </Category>
      ))}

      {unlisted.length ? (
        <Category header={<Translation i18nKey="other" capitalize={true} />}>
          <DiagnosticsContainer>
            {unlisted.map((element) => (
              <Hierarchy element={element} />
            ))}
          </DiagnosticsContainer>
        </Category>
      ) : null}
    </>
  );
};
