import {
  HierarchyElementDevice,
  HierarchyElementRoom,
  Levels,
  sortBy,
} from '../../web-api.js';
import { useCallback, useMemo } from 'preact/hooks';
import {
  useHierarchy,
  useLevelDeep,
  useMetaFilter,
} from '../../state/web-api.js';
import { Category } from '../../views/category.js';
import { Device } from '../../controls/device.js';
import { DeviceDetails } from '../sub/device.js';
import { FunctionComponent } from 'preact';
import { Grid } from '../../components/grid.js';
import { SubRoute } from '../../views/route.js';
import { Translation } from '../../state/i18n.js';
import { roomSorting as roomsSorting } from '../../i18n/mapping.js';
import { useArray } from '../../hooks/use-array-compare.js';
import { useSegment } from '../../state/path.js';

const FAKE_ROUTE_DIVIDER = '*';

const Room: FunctionComponent<{ room: HierarchyElementRoom }> = ({ room }) => {
  const {
    meta: { name },
  } = room;

  const devices = useMetaFilter(
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

  const [roomId, deviceId] = useMemo(
    () => route?.split(FAKE_ROUTE_DIVIDER) || ([] as undefined[]),
    [route]
  );

  const [room] = useMetaFilter(
    rooms,
    useCallback(({ name }) => name === roomId, [roomId])
  );

  const [device] = useMetaFilter(
    useLevelDeep<HierarchyElementDevice>(Levels.DEVICE, room || null),
    useCallback(({ name }) => name === deviceId, [deviceId])
  );

  return (
    <SubRoute
      subRoute={device ? <DeviceDetails device={device} /> : null}
      title={device?.meta.name}
    >
      {roomsSorted.map((aRoom) => (
        <Room room={aRoom} />
      ))}
    </SubRoute>
  );
};
