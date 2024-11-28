import { FunctionComponent } from 'preact';
import { useCallback } from 'preact/hooks';

import { useNavigationBuilding } from '../../state/navigation.js';
import { HallwayStream } from '../../views/hallway-stream.js';
import { Room } from './room.js';

export const Global: FunctionComponent = () => {
  const hierarchy = useHierarchy();
  const [building] = useNavigationBuilding();

  const globalProperties = useLevelShallow<HierarchyElementProperty>(
    Levels.PROPERTY,
    hierarchy,
  );
  const firstFloorProperties = useLevelShallow<HierarchyElementProperty>(
    Levels.PROPERTY,
    ...useMetaFilter(
      useLevelShallow<HierarchyElementFloor>(Levels.FLOOR, building),
      useCallback(({ name }) => name === 'firstFloor', []),
    ),
  );

  const entryDoor = useChild(building, 'entryDoor') as HierarchyElementArea;

  return (
    <Room elements={[...globalProperties, ...firstFloorProperties, entryDoor]}>
      <HallwayStream />
    </Room>
  );
};
