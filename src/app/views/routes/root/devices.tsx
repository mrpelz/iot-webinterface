import {
  HierarchyElementDevice,
  HierarchyElementRoom,
  Levels,
  sortBy,
} from '../../../web-api.js';
import { Translation, useI18nKey } from '../../../state/i18n.js';
import {
  noBackground,
  useSetBackgroundOverride,
} from '../../../state/background.js';
import { useCallback, useEffect, useMemo } from 'preact/hooks';
import {
  useElementFilter,
  useHierarchy,
  useLevelDeep,
} from '../../../state/web-api.js';
import { Category } from '../../category.js';
import { Device } from '../../controls/device.js';
import { DeviceDetails } from '../sub/device-details.js';
import { FunctionComponent } from 'preact';
import { Grid } from '../../../components/grid.js';
import { ShowHide } from '../../../components/show-hide.js';
import { roomSorting as roomsSorting } from '../../../i18n/mapping.js';
import { useArray } from '../../../util/use-array-compare.js';
import { useScrollRestore } from '../../../util/use-scroll-restore.js';
import { useSegment } from '../../../state/path.js';
import { useSetTitleOverride } from '../../../state/title.js';

const FAKE_ROUTE_DIVIDER = '❚';

const Room: FunctionComponent<{ room: HierarchyElementRoom }> = ({ room }) => {
  const {
    meta: { name },
  } = room;

  const devices = useElementFilter(
    useLevelDeep<HierarchyElementDevice>(Levels.DEVICE, room),
    useCallback(({ isSubDevice }) => !isSubDevice, [])
  );

  const [, setRoute] = useSegment(1);

  const onSelect = useCallback(
    (device: string) => {
      setRoute?.(`${name}${FAKE_ROUTE_DIVIDER}${device}`);
    },
    [name, setRoute]
  );

  return (
    <Category
      header={<Translation capitalize={true} i18nKey={name || undefined} />}
    >
      <Grid>
        {useMemo(
          () =>
            devices.map((device) => {
              return (
                <Device
                  device={device}
                  onSelect={() => onSelect(device.meta.name)}
                />
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
    useMemo(() => sortBy(rooms, 'name', roomsSorting).all, [rooms])
  );

  const [route] = useSegment(1);
  const setBackgroundOverride = useSetBackgroundOverride();
  const setTitleOverride = useSetTitleOverride();

  useEffect(
    () => () => setTitleOverride(null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [roomId, deviceId] = useMemo(
    () => route?.split(FAKE_ROUTE_DIVIDER) || ([] as undefined[]),
    [route]
  );

  const [room] = useElementFilter(
    rooms,
    useCallback(({ name }) => name === roomId, [roomId])
  );

  const [device] = useElementFilter(
    useLevelDeep<HierarchyElementDevice>(Levels.DEVICE, room || null),
    useCallback(({ name }) => name === deviceId, [deviceId])
  );

  const roomName = useI18nKey(roomId);

  useEffect(() => {
    setBackgroundOverride(roomName && device ? noBackground : null);

    setTitleOverride(device ? device.meta.name : null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device, roomName]);

  useScrollRestore(!device);

  return (
    <>
      <ShowHide show={!device}>
        {roomsSorted.map((aRoom) => (
          <Room room={aRoom} />
        ))}
      </ShowHide>
      {device ? <DeviceDetails device={device} /> : null}
    </>
  );
};
