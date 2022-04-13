import {
  HierarchyElementProperty,
  HierarchyElementPropertyActuator,
  Levels,
  groupBy,
  isMetaPropertyActuator,
} from '../../web-api.js';
import {
  useElementFilter,
  useHierarchy,
  useLevelShallow,
} from '../../state/web-api.js';
import { Category } from '../category.js';
import { DiagnosticsContainer } from '../../components/diagnostics.js';
import { FunctionComponent } from 'preact';
import { Hierarchy } from '../controls/diagnostics.js';
import { useMemo } from 'preact/hooks';
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
    ...useLevelShallow(Levels.FLOOR, building)
  );

  const globalElements = useElementFilter<
    HierarchyElementProperty,
    HierarchyElementPropertyActuator
  >(
    useMemo(
      () => [...globalProperties, ...firstFloorProperties],
      [firstFloorProperties, globalProperties]
    ),
    isMetaPropertyActuator
  );

  const groupedElements = useMemo(
    () => groupBy(globalElements, 'actuated'),
    [globalElements]
  );

  return (
    <>
      {groupedElements.map(({ elements, group }) => (
        <Category header={group}>
          <DiagnosticsContainer>
            {elements.map((element) => (
              <Hierarchy element={element} />
            ))}
          </DiagnosticsContainer>
        </Category>
      ))}
    </>
  );
};
