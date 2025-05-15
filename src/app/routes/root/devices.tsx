/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  excludePattern,
  Level,
  levelObjectMatch,
  TExclude,
} from '@iot/iot-monolith/tree';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { LevelObject } from '../../api.js';
import { Grid } from '../../components/grid.js';
import { Device } from '../../controls/device.js';
import { roomSorting as roomsSorting } from '../../i18n/mapping.js';
import { api } from '../../main.js';
import { $subPath, setSubPath } from '../../state/path.js';
import { sortBy } from '../../util/sort.js';
import { Category } from '../../views/category.js';
import { SubRoute } from '../../views/route.js';
import { Translation } from '../../views/translation.js';
import { DeviceDetails } from '../sub/devices/device.js';

// @ts-ignore
const rooms = api.match(levelObjectMatch[Level.ROOM], excludePattern);
const roomsSorted = sortBy(rooms, '$', roomsSorting).all;

const Room: FunctionComponent<{
  room: LevelObject[Level.ROOM];
}> = ({ room }) => {
  const { $ } = room;

  const devices = api.match(
    levelObjectMatch[Level.DEVICE],
    excludePattern,
    room,
  );

  return (
    <Category
      header={<Translation capitalize={true} i18nKey={$ || undefined} />}
    >
      <Grid>
        {useMemo(
          () =>
            devices.map((device) => (
              <Device device={device} onClick={() => setSubPath(device.$id)} />
            )),
          [devices],
        )}
      </Grid>
    </Category>
  );
};

export const Devices: FunctionComponent = () => {
  const device = api
    .match(
      {
        $id: $subPath.value,
        level: Level.DEVICE as const,
      },
      excludePattern,
    )
    .at(0);

  return (
    <SubRoute subRoute={device ? <DeviceDetails device={device} /> : null}>
      {roomsSorted.map((aRoom) => (
        <Room room={aRoom} />
      ))}
    </SubRoute>
  );
};
