import {
  DEFAULT_MATCH_DEPTH,
  excludePattern,
  Level,
  levelObjectMatch,
} from '@iot/iot-monolith/tree';
import { FunctionComponent } from 'preact';

import { LevelObject } from '../../api.js';
import { Grid } from '../../components/grid.js';
import { Actuator } from '../../controls/actuators/main.js';
import { Control } from '../../controls/main.js';
import { Sensor } from '../../controls/sensor/main.js';
import {
  useArray,
  useArrayExclude,
  useArrayUnique,
} from '../../hooks/use-array-compare.js';
import { useExtractKey } from '../../hooks/use-ensure-keys.js';
import { kitchenAdjacent$ } from '../../i18n/mapping.js';
import { useMatch } from '../../state/api.js';
import { $building } from '../../state/navigation.js';
import { $subPath } from '../../state/path.js';
import { Category } from '../../views/category.js';
import { SubRoute } from '../../views/route.js';
import { Translation } from '../../views/translation.js';
import { SubPage } from '../sub/room/main.js';

export const Room: FunctionComponent<{
  room: LevelObject[Level.ROOM];
}> = ({ room }) => {
  const { value: subPath } = $subPath;

  const kitchenAdjacentProperties = useArray([
    useExtractKey($building.value?.firstFloor, 'kitchenAdjacentBright'),
    useExtractKey($building.value?.firstFloor, 'kitchenAdjacentChillax'),
    useExtractKey($building.value?.firstFloor, 'kitchenAdjacentLights'),
  ]);

  const properties = useArrayUnique(
    [
      useMatch(levelObjectMatch[Level.PROPERTY], excludePattern, room, 1),
      kitchenAdjacent$.includes(room.$ as (typeof kitchenAdjacent$)[number])
        ? kitchenAdjacentProperties
        : [],
    ].flat(),
  );

  const security = useArrayUnique(
    [
      useExtractKey(room, 'entryDoor'),
      useExtractKey(room, 'door'),
      useExtractKey(room, 'allWindows'),
      useMatch({ $: 'window' as const }, excludePattern, properties, 1),
      useExtractKey(room, 'motion'),
    ].flat(),
  );

  const sensors = useArrayUnique(
    [
      useExtractKey(room, 'temperature'),
      useExtractKey(room, 'humidity'),
      useExtractKey(room, 'brightness'),
      useExtractKey(room, 'co2'),
      useExtractKey(room, 'tvoc'),
      useExtractKey(room, 'pm10'),
      useExtractKey(room, 'pm025'),
      useExtractKey(room, 'uvIndex'),
      useExtractKey(room, 'pressure'),
    ].flat(),
  );

  const lights = useArrayUnique(
    [
      useExtractKey(room, 'allLights'),
      useMatch(
        { $: 'outputGrouping' as const, topic: 'lighting' as const },
        excludePattern,
        properties,
        1,
      ),
      useMatch(
        { $: 'ledGrouping' as const, topic: 'lighting' as const },
        excludePattern,
        properties,
        1,
      ),
      useMatch(
        { $: 'output' as const, topic: 'lighting' as const },
        excludePattern,
        properties,
        1,
      ),
      useMatch(
        { $: 'led' as const, topic: 'lighting' as const },
        excludePattern,
        properties,
        1,
      ),
    ].flat(),
  );

  const scenes = useArray(
    [
      useMatch({ $: 'scene' as const }, excludePattern, properties, 1),
      useMatch({ $: 'triggerElement' as const }, excludePattern, properties, 1),
    ].flat(),
  );

  const timers = useMatch(
    { $: 'offTimer' as const },
    excludePattern,
    properties,
    1,
  );

  const rest = useArrayExclude(
    properties,
    [security, sensors, lights, scenes, timers].flat(),
  );

  const [subRouteElement] = useMatch(
    { $id: subPath },
    excludePattern,
    properties,
    (subPath ? undefined : -1) as typeof DEFAULT_MATCH_DEPTH,
  );

  return (
    <SubRoute
      subRoute={subRouteElement ? <SubPage object={subRouteElement} /> : null}
    >
      {security?.length ? (
        <Category header={<Translation capitalize={true} i18nKey="security" />}>
          <Grid>
            {security.map((item) => (
              <Sensor object={item} />
            ))}
          </Grid>
        </Category>
      ) : null}
      {sensors?.length ? (
        <Category header={<Translation capitalize={true} i18nKey="sensors" />}>
          <Grid>
            {sensors.map((item) => (
              <Sensor object={item} />
            ))}
          </Grid>
        </Category>
      ) : null}
      {lights?.length ? (
        <Category header={<Translation capitalize={true} i18nKey="lights" />}>
          <Grid>
            {lights.map((item) => (
              <Actuator object={item} />
            ))}
          </Grid>
        </Category>
      ) : null}
      {scenes?.length ? (
        <Category header={<Translation capitalize={true} i18nKey="scenes" />}>
          <Grid>
            {scenes.map((item) => (
              <Actuator object={item} />
            ))}
          </Grid>
        </Category>
      ) : null}
      {timers?.length ? (
        <Category header={<Translation capitalize={true} i18nKey="timers" />}>
          <Grid>
            {timers.map((item) => (
              <Actuator object={item} />
            ))}
          </Grid>
        </Category>
      ) : null}
      {rest?.length ? (
        <Grid>
          {rest.map((item) => (
            <Control object={item} />
          ))}
        </Grid>
      ) : null}
    </SubRoute>
  );
};
