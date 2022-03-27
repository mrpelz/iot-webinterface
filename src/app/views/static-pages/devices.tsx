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
import { Category } from '../category.js';
import { Device } from '../controls/device.js';
import { FunctionComponent } from 'preact';
import { Grid } from '../../components/grid.js';
import { rooms as roomsSorting } from '../../i18n/sorting.js';
import { useArray } from '../../util/use-array-compare.js';
import { useI18nKeyFallback } from '../../state/i18n.js';
import { useSegment } from '../../state/path.js';

const Room: FunctionComponent<{ room: HierarchyElementRoom }> = ({ room }) => {
  const {
    meta: { name },
  } = room;

  const [, setRoute1] = useSegment(1);

  const onSelect = useCallback(
    ({ meta: { name: deviceName } }: HierarchyElementDevice) => {
      setRoute1?.(`${name}›${deviceName}`);
    },
    [name, setRoute1]
  );

  const devices = useElementFilter(
    useCallback(({ isSubDevice }) => !isSubDevice, []),
    useLevelDeep<HierarchyElementDevice>(Levels.DEVICE, room)
  );

  return (
    <Category header={useI18nKeyFallback(name)}>
      <Grid>
        {useMemo(
          () =>
            devices.map((device) => {
              return (
                <Device device={device} onSelect={() => onSelect(device)} />
              );
            }),
          [devices, onSelect]
        )}
      </Grid>
    </Category>
  );
};

export const Devices: FunctionComponent = () => {
  const hierarchy = useHierarchy();

  const rooms = useLevelDeep<HierarchyElementRoom>(Levels.ROOM, hierarchy);
  const roomsSorted = useArray(
    useMemo(() => sortByName(rooms, roomsSorting), [rooms])
  );

  return (
    <>
      {roomsSorted.map((room) => (
        <Room room={room} />
      ))}
    </>
  );
};
