import { DEFAULT_MATCH_DEPTH, excludePattern } from '@iot/iot-monolith/tree';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { Grid } from '../../components/grid.js';
import { Actuator } from '../../controls/actuators/main.js';
import { Control } from '../../controls/main.js';
import { Sensor } from '../../controls/sensor/main.js';
import { useMatch } from '../../hooks/use-api.js';
import { globalProperties } from '../../state/global-properties.js';
import { $subPath } from '../../state/path.js';
import { roomProperties } from '../../state/room-properties.js';
import { Category } from '../../views/category.js';
import { SubRoute } from '../../views/route.js';
import { Translation } from '../../views/translation.js';
import { SubPage } from '../sub/room/main.js';

export const Room: FunctionComponent<{
  $properties:
    | ReturnType<typeof roomProperties>
    | ReturnType<typeof globalProperties>;
}> = ({
  children,
  $properties: {
    value: { lights, properties, rest, scenes, security, sensors, timers },
  },
}) => {
  const restControls = useMemo(
    // eslint-disable-next-line new-cap
    () => rest.map((object) => Control({ object })).filter(Boolean),
    [rest],
  );

  const { value: subPath } = $subPath;

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
      {children}
      {security.length > 0 ? (
        <Category header={<Translation capitalize={true} i18nKey="security" />}>
          <Grid>
            {security.map((item) => (
              <Sensor object={item} />
            ))}
          </Grid>
        </Category>
      ) : null}
      {sensors.length > 0 ? (
        <Category header={<Translation capitalize={true} i18nKey="sensors" />}>
          <Grid>
            {sensors.map((item) => (
              <Sensor object={item} />
            ))}
          </Grid>
        </Category>
      ) : null}
      {lights.length > 0 ? (
        <Category header={<Translation capitalize={true} i18nKey="lights" />}>
          <Grid>
            {lights.map((item) => (
              <Actuator object={item} />
            ))}
          </Grid>
        </Category>
      ) : null}
      {scenes.length > 0 ? (
        <Category header={<Translation capitalize={true} i18nKey="scenes" />}>
          <Grid>
            {scenes.map((item) => (
              <Actuator object={item} />
            ))}
          </Grid>
        </Category>
      ) : null}
      {timers.length > 0 ? (
        <Category header={<Translation capitalize={true} i18nKey="timers" />}>
          <Grid>
            {timers.map((item) => (
              <Actuator object={item} />
            ))}
          </Grid>
        </Category>
      ) : null}
      {restControls.length > 0 ? (
        <Category
          header={<Translation capitalize={true} i18nKey="miscellaneous" />}
        >
          <Grid>{restControls.map((item) => item)}</Grid>
        </Category>
      ) : null}
    </SubRoute>
  );
};
