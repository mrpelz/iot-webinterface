/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  DEFAULT_MATCH_DEPTH,
  excludePattern,
  Level,
  levelObjectMatch,
  TExclude,
} from '@iot/iot-monolith/tree';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { LevelObject, serialized } from '../../api.js';
import { Grid } from '../../components/grid.js';
import { Device } from '../../controls/device.js';
import { roomSorting as roomsSorting } from '../../i18n/mapping.js';
import { api } from '../../main.js';
import { setSubPath, subPath$ } from '../../state/path.js';
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
    { ...levelObjectMatch[Level.DEVICE], isSubDevice: false as const },
    excludePattern,
    room,
  );

  return (
    <Category
      header={
        <Translation
          capitalize={true}
          i18nKey={$ || undefined}
        />
      }
    >
      <Grid>
        {useMemo(
          () =>
            devices.map((device) => (
              <Device
                key={serialized(device).$id}
                device={device}
                onClick={() => setSubPath(device.$id)}
              />
            )),
          [devices],
        )}
      </Grid>
    </Category>
  );
};

export const Devices: FunctionComponent = () => {
  const {
    value: [depth, tail],
  } = subPath$;

  const device = api
    .match(
      {
        $id: tail,
        level: Level.DEVICE as const,
      },
      excludePattern,
      undefined,
      (tail && depth > 1 ? undefined : -1) as typeof DEFAULT_MATCH_DEPTH,
    )
    .at(0);

  return (
    <SubRoute subRoute={device ? <DeviceDetails device={device} /> : null}>
      {roomsSorted.map((aRoom) => (
        <Room
          key={serialized(aRoom).$id}
          room={aRoom}
        />
      ))}
    </SubRoute>
  );
};
