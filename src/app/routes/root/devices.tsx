/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Level, levelObjectMatch } from '@iot/iot-monolith/tree';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { LevelObject, sortBy } from '../../api.js';
import { Grid } from '../../components/grid.js';
// import { Device } from '../../controls/device.js';
import { useArray } from '../../hooks/use-array-compare.js';
import { roomSorting as roomsSorting } from '../../i18n/mapping.js';
import { useMatch } from '../../state/api.js';
import { Translation } from '../../state/i18n.js';
// import { useSegment } from '../../state/path.js';
import { Category } from '../../views/category.js';
import { SubRoute } from '../../views/route.js';
// import { DeviceDetails } from '../sub/devices/device.js';

// @ts-ignore
const Room: FunctionComponent<{ room: LevelObject[Level.ROOM] }> = ({
  room,
}) => {
  // const [, setDeviceId] = useSegment(1);

  const { $ } = room;

  const devices = useMatch(
    { isSubDevice: false as const, level: Level.DEVICE as const },
    room,
  );

  return (
    <Category
      header={<Translation capitalize={true} i18nKey={$ || undefined} />}
    >
      <Grid>
        {useMemo(
          () =>
            devices.map(
              () =>
                // <Device
                //   device={device}
                //   onClick={() => setDeviceId?.(device.$id)}
                // />
                null,
            ),
          [devices],
        )}
      </Grid>
    </Category>
  );
};

export const Devices: FunctionComponent = () => {
  // const [deviceId] = useSegment(1);

  // @ts-ignore
  const rooms = useMatch(levelObjectMatch[Level.ROOM]);
  const roomsSorted = useArray(
    useMemo(() => sortBy(rooms, '$', roomsSorting).all, [rooms]),
  );

  // const [device] = useMatch({ $id: deviceId, level: Level.DEVICE as const });

  return (
    <SubRoute
      subRoute={
        // device ? <DeviceDetails device={device} /> :
        null
      }
    >
      {roomsSorted.map((aRoom) => (
        <Room room={aRoom} />
      ))}
    </SubRoute>
  );
};
