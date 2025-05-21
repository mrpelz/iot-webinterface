import { ensureKeys } from '@iot/iot-monolith/oop';
import {
  any,
  DEFAULT_MATCH_DEPTH,
  excludePattern,
  Level,
} from '@iot/iot-monolith/tree';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { AnyObject, groupBy, sortBy } from '../../api.js';
import { Grid } from '../../components/grid.js';
import { Control } from '../../controls/main.js';
import { BinarySensor } from '../../controls/sensor/binary.js';
import { useArray } from '../../hooks/use-array-compare.js';
import { actuated, measuredCategories } from '../../i18n/mapping.js';
import { useMatch } from '../../state/api.js';
import { $subPath } from '../../state/path.js';
import { Category } from '../../views/category.js';
import { SubRoute } from '../../views/route.js';
import { Translation } from '../../views/translation.js';
import { SubPage } from '../sub/room/main.js';

export const Room: FunctionComponent<{
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  object: AnyObject;
}> = ({ children, object }) => {
  const { allWindows } = useMemo(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    () => ensureKeys(object, 'allWindows'),
    [object],
  );
  const { scenes: scenesRoot } = useMemo(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    () => ensureKeys(object, 'scenes'),
    [object],
  );
  const doors = useMatch({ $: 'door' as const }, excludePattern, object);
  const windows = useMatch({ $: 'window' as const }, excludePattern, object);
  const properties = useMatch(
    { level: Level.PROPERTY as const, topic: any },
    excludePattern,
    object,
    1,
  );
  const scenes = useArray(
    [
      useMatch({ $: 'scene' as const }, excludePattern, scenesRoot, 1),
      useMatch({ $: 'triggerElement' as const }, excludePattern, scenesRoot, 1),
    ].flat(1),
  );

  const securitySensors = useMemo(
    () =>
      sortBy(properties, 'topic', measuredCategories.security).listedResults,
    [properties],
  );

  const airQualitySensors = useMemo(
    () =>
      sortBy(properties, 'topic', measuredCategories.airQuality).listedResults,
    [properties],
  );

  const airSafetySensors = useMemo(
    () =>
      sortBy(properties, 'topic', measuredCategories.airSafety).listedResults,
    [properties],
  );

  const environmentalSensors = useMemo(
    () =>
      sortBy(properties, 'topic', measuredCategories.environmental)
        .listedResults,
    [properties],
  );

  const [listedActuators, unlistedActuators] = useMemo(() => {
    const { listedResults, unlistedResults } = sortBy(
      properties,
      'topic',
      actuated,
    );

    return [groupBy(listedResults, 'topic'), unlistedResults] as const;
  }, [properties]);

  const { value: subPath } = $subPath;
  const [subRouteElement] = useMatch(
    { $id: subPath },
    excludePattern,
    object,
    (subPath ? undefined : -1) as typeof DEFAULT_MATCH_DEPTH,
  );

  return (
    <SubRoute
      subRoute={subRouteElement ? <SubPage object={subRouteElement} /> : null}
    >
      {children}
      {[securitySensors, doors, windows].flat().length > 0 ? (
        <Category header={<Translation i18nKey="security" capitalize={true} />}>
          <Grid>
            {securitySensors.map((element) => (
              <Control object={element} />
            ))}
            {allWindows ? (
              <BinarySensor
                sensor={allWindows}
                negativeKey="allClosed"
                positiveKey="open"
                title="allWindows"
              />
            ) : null}
            {doors.map((element) => (
              <Control object={element} />
            ))}
            {windows.map((element) => (
              <Control object={element} />
            ))}
          </Grid>
        </Category>
      ) : null}
      {airQualitySensors.length > 0 ? (
        <Category
          header={<Translation i18nKey="airQuality" capitalize={true} />}
        >
          <Grid>
            {airQualitySensors.map((element) => (
              <Control object={element} />
            ))}
          </Grid>
        </Category>
      ) : null}
      {airSafetySensors.length > 0 ? (
        <Category
          header={<Translation i18nKey="airSafety" capitalize={true} />}
        >
          <Grid>
            {airSafetySensors.map((element) => (
              <Control object={element} />
            ))}
          </Grid>
        </Category>
      ) : null}
      {environmentalSensors.length > 0 ? (
        <Category
          header={<Translation i18nKey="environmental" capitalize={true} />}
        >
          <Grid>
            {environmentalSensors.map((element) => (
              <Control object={element} />
            ))}
          </Grid>
        </Category>
      ) : null}

      {listedActuators.map(({ elements, group }) => (
        <Category header={<Translation i18nKey={group} capitalize={true} />}>
          <Grid>
            {elements.map((element) => (
              <Control object={element} />
            ))}
          </Grid>
        </Category>
      ))}

      {scenes.length > 0 ? (
        <Category header={<Translation i18nKey={'scenes'} capitalize={true} />}>
          <Grid>
            {scenes.map((element) => (
              <Control object={element} />
            ))}
          </Grid>
        </Category>
      ) : null}

      <Category header={<Translation i18nKey={'other'} capitalize={true} />}>
        <Grid>
          {unlistedActuators.map((element) => (
            <Control object={element} />
          ))}
        </Grid>
      </Category>
    </SubRoute>
  );
};
