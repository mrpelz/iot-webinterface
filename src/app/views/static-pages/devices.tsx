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
import { ElementDiagnostics } from '../controls/element-diagnostics.js';
import { FunctionComponent } from 'preact';
import { Grid } from '../../components/grid.js';
import { ShowHide } from '../../components/show-hide.js';
import { rooms as roomsSorting } from '../../i18n/sorting.js';
import { useArray } from '../../util/use-array-compare.js';
import { useI18nKey } from '../../state/i18n.js';
import { useScrollRestore } from '../../util/use-scroll-restore.js';
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

  const [roomId, deviceId] = useMemo(
    () => route1?.split('›') || ([] as null[]),
    [route1]
  );

  const [room] =
    useElementFilter(
      useCallback(({ name }) => name === roomId, [roomId]),
      rooms
    ) || ([] as null[]);

  const [device] =
    useElementFilter(
      useCallback(({ name }) => name === deviceId, [deviceId]),
      useLevelDeep<HierarchyElementDevice>(Levels.DEVICE, room)
    ) || ([] as null[]);

  useEffect(() => {
    setTitleOverride(device?.meta.name || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device]);

  useScrollRestore(!device);

  return (
    <>
      <ShowHide show={!device}>
        {roomsSorted.map((aRoom) => (
          <Room room={aRoom} />
        ))}
      </ShowHide>
      {device ? <ElementDiagnostics element={device} /> : null}
    </>
  );
};
