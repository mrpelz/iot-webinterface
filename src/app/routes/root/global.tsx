import {
  HierarchyElementArea,
  HierarchyElementFloor,
  HierarchyElementProperty,
  HierarchyElementPropertyActuator,
  Levels,
  groupBy,
  isMetaPropertyActuator,
  sortBy,
} from '../../web-api.js';
import { useCallback, useMemo } from 'preact/hooks';
import {
  useChild,
  useHierarchy,
  useLevelShallow,
  useMetaFilter,
} from '../../state/web-api.js';
import { Category } from '../../views/category.js';
import { Control } from '../../controls/main.js';
import { FunctionComponent } from 'preact';
import { Grid } from '../../components/grid.js';
import { Translation } from '../../state/i18n.js';
import { actuated } from '../../i18n/mapping.js';
import { useNavigationBuilding } from '../../state/navigation.js';

export const Global: FunctionComponent = () => {
  const hierarchy = useHierarchy();
  const [building] = useNavigationBuilding();

  const globalProperties = useLevelShallow<HierarchyElementProperty>(
    Levels.PROPERTY,
    hierarchy
  );
  const firstFloorProperties = useLevelShallow<HierarchyElementProperty>(
    Levels.PROPERTY,
    ...useMetaFilter(
      useLevelShallow<HierarchyElementFloor>(Levels.FLOOR, building),
      useCallback(({ name }) => name === 'firstFloor', [])
    )
  );

  const entryDoor = useChild(building, 'entryDoor') as HierarchyElementArea;

  const actuators = useMetaFilter<
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
          <Grid>
            <Control element={entryDoor} title="entryDoor" />
          </Grid>
        </Category>
      ) : null}

      {listed.map(({ elements, group }) => (
        <Category header={<Translation i18nKey={group} capitalize={true} />}>
          <Grid>
            {elements.map((element) => (
              <Control element={element} />
            ))}
          </Grid>
        </Category>
      ))}

      {unlisted.length ? (
        <Category header={<Translation i18nKey="other" capitalize={true} />}>
          <Grid>
            {unlisted.map((element) => (
              <Control element={element} />
            ))}
          </Grid>
        </Category>
      ) : null}
    </>
  );
};
