import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { api, Level, Match } from '../../api.js';
import { Grid } from '../../components/grid.js';
import { Device } from '../../controls/device.js';
import { roomSorting as roomsSorting } from '../../i18n/mapping.js';
import { $setSubPath, $subPath } from '../../state/path.js';
import { getSignal } from '../../util/signal.js';
import { sortBy } from '../../util/sort.js';
import { Category } from '../../views/category.js';
import { SubRoute } from '../../views/route.js';
import { Translation } from '../../views/translation.js';
import { DeviceDetails } from '../sub/devices/device.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const rooms = api.match({ level: Level.ROOM as const });
const roomsSorted = sortBy(rooms, '$', roomsSorting).all;

const Room: FunctionComponent<{ room: Match<{ level: Level.ROOM }> }> = ({
  room,
}) => {
  const { $: name } = room;

  const devices = api.match({ level: Level.DEVICE as const }, undefined, room);

  return (
    <Category
      header={<Translation capitalize={true} i18nKey={name || undefined} />}
    >
      <Grid>
        {useMemo(
          () =>
            devices.map((device) => (
              <Device
                device={device}
                onClick={() => {
                  getSignal($setSubPath);
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
  const subPath = getSignal($subPath);
  const device = api
    .match({
      $ref: { id: subPath },
      level: Level.DEVICE as const,
    })
    .at(0);

  // eslint-disable-next-line no-console
  console.log(subPath);

  return (
    <SubRoute subRoute={device ? <DeviceDetails device={device} /> : null}>
      {roomsSorted.map((aRoom) => (
        <Room room={aRoom} />
      ))}
    </SubRoute>
  );
};
