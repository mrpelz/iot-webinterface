import {
  DEFAULT_MATCH_DEPTH,
  excludePattern,
  Level,
} from '@iot/iot-monolith/tree';
import { ensureKeys } from '@mrpelz/misc-utils/oop';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { LevelObject } from '../../api.js';
import { Grid } from '../../components/grid.js';
import { BinaryActuator } from '../../controls/actuators/binary.js';
import { BrightnessActuator } from '../../controls/actuators/brightness.js';
import { NullActuator } from '../../controls/actuators/null.js';
import { Control } from '../../controls/main.js';
import { BinarySensor } from '../../controls/sensor/binary.js';
import { OpenSensor } from '../../controls/sensor/open.js';
import { useArray } from '../../hooks/use-array-compare.js';
import { useMatch } from '../../state/api.js';
import { $subPath } from '../../state/path.js';
import { deduplicate } from '../../util/deduplicate.js';
import { Category } from '../../views/category.js';
import { SubRoute } from '../../views/route.js';
import { Translation } from '../../views/translation.js';
import { SubPage } from '../sub/room/main.js';

export const Room: FunctionComponent<{
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  properties: LevelObject[Level.PROPERTY][];
}> = ({ children, properties }) => {
  const { value: subPath } = $subPath;

  const security_ = useMatch(
    { topic: 'security' as const },
    excludePattern,
    properties,
    1,
  );

  const doors_ = useMatch(
    { $: 'door' as const },
    excludePattern,
    properties,
    1,
  );

  const scenes_ = useMatch(
    { $: 'scene' as const },
    excludePattern,
    properties,
    1,
  );
  const triggers_ = useMatch(
    { $: 'triggerElement' as const },
    excludePattern,
    properties,
    1,
  );

  const binaryLights_ = useArray(
    [
      useMatch(
        { $: 'outputGrouping' as const, topic: 'lighting' as const },
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
    ].flat(1),
  );
  const brightnessLights_ = useArray(
    [
      useMatch({ $: 'ledGrouping' as const }, excludePattern, properties, 1),
      useMatch({ $: 'led' as const }, excludePattern, properties, 1),
    ].flat(1),
  );

  const {
    binaryLights,
    brightnessLights,
    doors,
    otherProperties,
    scenes,
    security,
    triggers,
  } = useMemo(() => {
    const [
      /* eslint-disable @typescript-eslint/naming-convention */
      security__,
      doors__,
      scenes__,
      triggers__,
      binaryLights__,
      brightnessLights__,
      /* eslint-enable @typescript-eslint/naming-convention */
    ] = deduplicate([
      security_,
      doors_,
      scenes_,
      triggers_,
      binaryLights_,
      brightnessLights_,
    ]);

    const categorizedProperties = [
      binaryLights__,
      brightnessLights__,
      doors__,
      scenes__,
      security__,
      triggers__,
    ].flat(1);

    const remainingProperties = properties.filter(
      (item) =>
        !categorizedProperties.includes(
          item as (typeof categorizedProperties)[number],
        ),
    ) as Exclude<
      (typeof properties)[number],
      (typeof categorizedProperties)[number]
    >[];

    return {
      binaryLights: binaryLights__,
      brightnessLights: brightnessLights__,
      doors: doors__,
      otherProperties: remainingProperties.toSorted((item) =>
        ensureKeys(item, 'main').main?.$ === 'setter' ? -1 : 1,
      ),
      scenes: scenes__,
      security: security__,
      triggers: triggers__,
    };
  }, [
    binaryLights_,
    brightnessLights_,
    doors_,
    properties,
    scenes_,
    security_,
    triggers_,
  ]);

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
            {security.map((item) =>
              'open' in item ? (
                <OpenSensor sensor={item} />
              ) : (
                <BinarySensor
                  negativeKey="allClosed"
                  positiveKey="open"
                  sensor={item}
                />
              ),
            )}
          </Grid>
        </Category>
      ) : null}

      {doors.length > 0 ? (
        <Category header={<Translation capitalize={true} i18nKey="doors" />}>
          <Grid>
            {doors.map((item) => (
              <OpenSensor sensor={item} />
            ))}
          </Grid>
        </Category>
      ) : null}

      {scenes.length > 0 || triggers.length > 0 ? (
        <Category header={<Translation capitalize={true} i18nKey="scenes" />}>
          <Grid>
            {scenes.map((scene) => (
              <BinaryActuator actuator={scene} />
            ))}
            {triggers.map((trigger) => (
              <NullActuator actuator={trigger} />
            ))}
          </Grid>
        </Category>
      ) : null}

      {binaryLights.length > 0 || brightnessLights.length > 0 ? (
        <Category header={<Translation capitalize={true} i18nKey="lights" />}>
          <Grid>
            {binaryLights.map((light) => (
              <BinaryActuator actuator={light} />
            ))}
            {brightnessLights.map((light) => (
              <BrightnessActuator actuator={light} />
            ))}
          </Grid>
        </Category>
      ) : null}

      {otherProperties.length > 0 ? (
        <Category header={<Translation capitalize={true} i18nKey="other" />}>
          <Grid>
            {otherProperties.map((item) => (
              <Control object={item} />
            ))}
          </Grid>
        </Category>
      ) : null}
    </SubRoute>
  );
};
