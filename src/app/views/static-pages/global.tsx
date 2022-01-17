import { DiagnosticsContainer, Hierarchy } from './diagnostics.js';
import { HierarchyElementProperty, Levels } from '../../web-api.js';
import { useHierarchy, useLevel } from '../../state/web-api.js';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';
import { useNavigationBuilding } from '../../state/navigation.js';

export const Global: FunctionComponent = () => {
  const hierarchy = useHierarchy();
  const [building] = useNavigationBuilding();

  const globalProperties = useLevel<HierarchyElementProperty>(
    Levels.PROPERTY,
    hierarchy
  );
  const firstFloorProperties = useLevel<HierarchyElementProperty>(
    Levels.PROPERTY,
    ...useLevel(Levels.FLOOR, building)
  );

  const globalElements = useMemo(
    () =>
      [...globalProperties, ...firstFloorProperties].filter(
        (element): element is HierarchyElementProperty => Boolean(element)
      ),
    [firstFloorProperties, globalProperties]
  );

  return (
    <DiagnosticsContainer>
      {globalElements.map((element) => (
        <Hierarchy element={element} />
      ))}
    </DiagnosticsContainer>
  );
};
