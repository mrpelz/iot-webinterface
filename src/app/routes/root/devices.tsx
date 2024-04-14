import { FunctionComponent } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

import { Grid } from '../../components/grid.js';
import { Device } from '../../controls/device.js';
import { useArray } from '../../hooks/use-array-compare.js';
import { roomSorting as roomsSorting } from '../../i18n/mapping.js';
import { $setSubPath, $subPath } from '../../state/path.js';
import {
  useElementFilter,
  useElements,
  useHierarchy,
  useLevelDeep,
  useMetaFilter,
} from '../../state/web-api.js';
import { getSignal } from '../../util/signal.js';
import { Category } from '../../views/category.js';
import { SubRoute } from '../../views/route.js';
import { Translation } from '../../views/translation.js';
import {
  HierarchyElement,
  HierarchyElementDevice,
  HierarchyElementRoom,
  Levels,
  sortBy,
} from '../../web-api.js';
import { DeviceDetails } from '../sub/devices/device.js';

const Room: FunctionComponent<{ room: HierarchyElementRoom }> = ({ room }) => {
  const {
    meta: { name },
  } = room;

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
                onClick={() => {
                  getSignal($setSubPath)(device.id);
                }}
              />
            )),
          [devices],
        )}
      </Grid>
    </Category>
  );
};

export const Devices: FunctionComponent = () => {
  const hierarchy = useHierarchy();
  const elements = useElements();

  const subPath = getSignal($subPath);

  const rooms = useLevelDeep<HierarchyElementRoom>(Levels.ROOM, hierarchy);
  const roomsSorted = useArray(
    useMemo(() => sortBy(rooms, 'name', roomsSorting).all, [rooms]),
  );

  const [device] = useElementFilter<HierarchyElement, HierarchyElementDevice>(
    subPath ? elements : null,
    useCallback(({ id }) => id === subPath, [subPath]),
  );

  return (
    <SubRoute subRoute={device ? <DeviceDetails device={device} /> : null}>
      {roomsSorted.map((aRoom) => (
        <Room room={aRoom} />
      ))}
    </SubRoute>
  );
};
