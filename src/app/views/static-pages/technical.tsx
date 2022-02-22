import {
  HierarchyElementDevice,
  HierarchyElementRoom,
  Levels,
  sortByName,
} from '../../web-api.js';
import { useCallback, useMemo } from 'preact/hooks';
import {
  useElementFilter,
  useHierarchy,
  useLevelDeep,
} from '../../state/web-api.js';
import { Category } from '../../components/category.js';
import { Device } from '../controls/device.js';
import { FunctionComponent } from 'preact';
import { Grid } from '../../components/grid.js';
import { rooms as roomsSorting } from '../../i18n/sorting.js';
import { useArray } from '../../util/array-compare.js';
import { useI18nKeyFallback } from '../../state/i18n.js';
import { useMemoShorthand } from '../../util/use-memo-shorthand.js';

const Room: FunctionComponent<{ room: HierarchyElementRoom }> = ({ room }) => {
  const {
    meta: { name },
  } = room;

  const devices = useElementFilter(
    useCallback(({ isSubDevice }) => !isSubDevice, []),
    useLevelDeep<HierarchyElementDevice>(Levels.DEVICE, room)
  );

  return (
    <Category header={useI18nKeyFallback(name)}>
      <Grid>
        {useMemo(
          () => devices.map((device) => <Device device={device} />),
          [devices]
        )}
      </Grid>
    </Category>
  );
};

export const Technical: FunctionComponent = () => {
  const hierarchy = useHierarchy();

  const rooms = useArray(
    useMemoShorthand(
      useLevelDeep<HierarchyElementRoom>(Levels.ROOM, hierarchy),
      useCallback((elements) => sortByName(elements, roomsSorting), [])
    )
  );

  return (
    <>
      {rooms.map((room) => (
        <Room room={room} />
      ))}
    </>
  );
};
