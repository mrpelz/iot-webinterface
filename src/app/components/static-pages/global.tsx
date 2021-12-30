import { Hierarchy, _DiagnosticsContainer } from './diagnostics.js';
import { Levels, getElementsFromLevel } from '../../web-api.js';
import { FunctionComponent } from 'preact';
import { useBuilding } from '../../hooks/navigation.js';
import { useHierarchy } from '../../hooks/web-api.js';
import { useMemo } from 'preact/hooks';

export const Global: FunctionComponent = () => {
  const hierarchy = useHierarchy();
  const { state: building } = useBuilding();

  const globalElements = useMemo(
    () =>
      [
        getElementsFromLevel(
          Object.values(hierarchy?.children || {}),
          Levels.PROPERTY
        ),
        getElementsFromLevel(
          Object.values(building?.children || {}),
          Levels.FLOOR
        )
          .map((floor) =>
            getElementsFromLevel(
              Object.values(floor.children || {}),
              Levels.PROPERTY
            )
          )
          .flat(),
      ].flat(),
    [building?.children, hierarchy?.children]
  );
  return (
    <_DiagnosticsContainer>
      {globalElements.map((element) => (
        <Hierarchy element={element} />
      ))}
    </_DiagnosticsContainer>
  );
};
