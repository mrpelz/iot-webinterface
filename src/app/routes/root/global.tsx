import {
  excludePattern,
  Level,
  levelObjectMatch,
} from '@iot/iot-monolith/tree';
import { computed } from '@preact/signals';
import { FunctionComponent } from 'preact';

import { api } from '../../main.js';
import { $building, $floors, $home, $root } from '../../state/navigation.js';
import { $flags } from '../../util/flags.js';
import { HallwayStream } from '../../views/hallway-stream.js';
import { Room } from './room.js';

const $rootProperties = computed(() =>
  api.match(levelObjectMatch[Level.PROPERTY], excludePattern, $root.value, 1),
);

const $homeProperties = computed(() =>
  api.match(levelObjectMatch[Level.PROPERTY], excludePattern, $home.value, 1),
);

const $buildingProperties = computed(() =>
  api.match(
    levelObjectMatch[Level.PROPERTY],
    excludePattern,
    $building.value,
    1,
  ),
);

const $floorProperties = computed(() =>
  $floors.value?.flatMap((floor) =>
    api.match(levelObjectMatch[Level.PROPERTY], excludePattern, floor, 1),
  ),
);

const $properties = computed(() =>
  [
    $rootProperties.value,
    $homeProperties.value,
    $buildingProperties.value,
    $floorProperties.value,
  ]
    .flat()
    .filter((item): item is Exclude<typeof item, undefined> => Boolean(item)),
);

export const Global: FunctionComponent = () => (
  <Room properties={$properties.value}>
    {$flags.hallwayStreamEnable.value ? <HallwayStream /> : null}
  </Room>
);
