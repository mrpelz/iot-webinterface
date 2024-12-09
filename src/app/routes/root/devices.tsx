import { FunctionComponent } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

import { sortBy } from '../../api.js';
import { Grid } from '../../components/grid.js';
import { Device } from '../../controls/device.js';
import { useArray } from '../../hooks/use-array-compare.js';
import { roomSorting as roomsSorting } from '../../i18n/mapping.js';
import { Translation } from '../../state/i18n.js';
import { useSegment } from '../../state/path.js';
import {
  useElementFilter,
  useElements,
  useHierarchy,
  useLevelDeep,
  useMetaFilter,
} from '../../state/web-api.js';
import { Category } from '../../views/category.js';
import { SubRoute } from '../../views/route.js';
import {
  HierarchyElement,
  HierarchyElementDevice,
  HierarchyElementRoom,
  Levels,
} from '../../web-api.js';
import { DeviceDetails } from '../sub/devices/device.js';

const Room: FunctionComponent<{ room: HierarchyElementRoom }> = ({ room }) => {
  const {
    meta: { name },
  } = room;

  const [, setDeviceId] = useSegment(1);

  const devices = useMetaFilter(
    useLevelDeep<HierarchyElementDevice>(Levels.DEVICE, room),
    useCallback(({ isSubDevice }) => !isSubDevice, []),
  );

  return (
    <Category
      header={<Translation capitalize={true} i18nKey={name || undefined} />}
    >
      <Grid>
        {useMemo(
          () =>
            devices.map((device) => (
              <Device
                element={device}
                onClick={() => setDeviceId?.(device.id)}
              />
            )),
          [devices, setDeviceId],
        )}
      </Grid>
    </Category>
  );
};

export const Devices: FunctionComponent = () => {
  const hierarchy = useHierarchy();
  const elements = useElements();

  const [deviceId] = useSegment(1);

  const rooms = useLevelDeep<HierarchyElementRoom>(Levels.ROOM, hierarchy);
  const roomsSorted = useArray(
    useMemo(() => sortBy(rooms, 'name', roomsSorting).all, [rooms]),
  );

  const [device] = useElementFilter<HierarchyElement, HierarchyElementDevice>(
    deviceId ? elements : null,
    useCallback(({ id }) => id === deviceId, [deviceId]),
  );

  return (
    <SubRoute subRoute={device ? <DeviceDetails device={device} /> : null}>
      {roomsSorted.map((aRoom) => (
        <Room room={aRoom} />
      ))}
    </SubRoute>
  );
};
