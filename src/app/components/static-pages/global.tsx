import { Hierarchy, _DiagnosticsContainer } from './diagnostics.js';
import { HierarchyElementProperty, Levels } from '../../web-api.js';
import { useHierarchy, useLevel } from '../../hooks/web-api.js';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';
import { useNavigationBuilding } from '../../hooks/navigation.js';

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
    <_DiagnosticsContainer>
      {globalElements.map((element) => (
        <Hierarchy element={element} />
      ))}
    </_DiagnosticsContainer>
  );
};
