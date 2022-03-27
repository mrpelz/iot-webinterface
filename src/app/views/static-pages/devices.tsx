import {
  HierarchyElementDevice,
  HierarchyElementRoom,
  Levels,
  sortByName,
} from '../../web-api.js';
import { useCallback, useEffect, useMemo } from 'preact/hooks';
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
import { useI18nKey } from '../../state/i18n.js';
import { useSegment } from '../../state/path.js';
import { useSetTitleOverride } from '../../state/title.js';

const Room: FunctionComponent<{ room: HierarchyElementRoom }> = ({ room }) => {
  const {
    meta: { name },
  } = room;

  const roomName = useI18nKey(name);

  const devices = useElementFilter(
    useCallback(({ isSubDevice }) => !isSubDevice, []),
    useLevelDeep<HierarchyElementDevice>(Levels.DEVICE, room)
  );

  const [, setRoute1] = useSegment(1);

  const onSelect = useCallback(
    (device: string) => {
      setRoute1?.(`${name}›${device}`);
    },
    [name, setRoute1]
  );

  return (
    <Category header={roomName}>
      <Grid>
        {useMemo(() => {
          if (!devices) return null;

          return devices.map((device) => {
            return (
              <Device
                device={device}
                onSelect={() => onSelect(device.meta.name)}
              />
            );
          });
        }, [devices, onSelect])}
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

  const [route1] = useSegment(1);
  const setTitleOverride = useSetTitleOverride();

  useEffect(
    () => () => setTitleOverride(null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [room, device] = useMemo(
    () => route1?.split('›') || ([] as null[]),
    [route1]
  );

  const roomName = useI18nKey(room || undefined);

  useEffect(() => {
    setTitleOverride(roomName && device ? `${roomName} › ${device}` : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device, roomName]);

  return (
    <>
      {roomsSorted.map((aRoom) => (
        <Room room={aRoom} />
      ))}
    </>
  );
};
