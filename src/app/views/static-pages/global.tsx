import { HierarchyElementProperty, Levels } from '../../web-api.js';
import { useHierarchy, useLevelShallow } from '../../state/web-api.js';
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
