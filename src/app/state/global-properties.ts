/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  anyString,
  excludePattern,
  Level,
  levelObjectMatch,
} from '@iot/iot-monolith/tree';
import { computed } from '@preact/signals';

import { api } from '../main.js';
import { exclude, unique } from '../util/array.js';
import { extractKey } from '../util/oop.js';
import { $building, $home, $root } from './navigation.js';

export const globalProperties = () => {
  const $hallway = computed(
    () => $root.value?.wurstHome.sonninstraße16.firstFloor.hallway,
  );

  const $properties = computed(() =>
    unique(
      [
        api.match({ $: anyString }, excludePattern, $hallway.value, 1),
        api.match(
          levelObjectMatch[Level.PROPERTY],
          excludePattern,
          $root.value,
          1,
        ),
        api.match(
          levelObjectMatch[Level.PROPERTY],
          excludePattern,
          $home.value,
          1,
        ),
        api.match(
          levelObjectMatch[Level.PROPERTY],
          excludePattern,
          $building.value,
          1,
        ),
        $building.value?.firstFloor.kitchenAdjacentBright,
        $building.value?.firstFloor.kitchenAdjacentChillax,
        $building.value?.firstFloor.kitchenAdjacentLights,
      ].flat(),
    ),
  );

  const $security = computed(() =>
    unique(
      [
        api.match(
          { $: 'window' as const },
          excludePattern,
          $properties.value,
          1,
        ),
        $building.value?.entryDoor,
        $hallway.value ? extractKey($hallway.value, 'motion') : [],
        $root.value?.allWindows,
        $root.value?.allMotion,
      ].flat(),
    ),
  );

  const $lights = computed(() =>
    unique(
      [
        $root.value?.allLights,
        api.match(
          { $: 'outputGrouping' as const, topic: 'lighting' as const },
          excludePattern,
          $properties.value,
          1,
        ),
        api.match(
          { $: 'ledGrouping' as const, topic: 'lighting' as const },
          excludePattern,
          $properties.value,
          1,
        ),
        api.match(
          { $: 'output' as const, topic: 'lighting' as const },
          excludePattern,
          $properties.value,
          1,
        ),
        api.match(
          { $: 'led' as const, topic: 'lighting' as const },
          excludePattern,
          $properties.value,
          1,
        ),
      ].flat(),
    ),
  );

  const $scenes = computed(() =>
    unique(
      [
        api.match(
          { $: 'scene' as const },
          excludePattern,
          $properties.value,
          1,
        ),
        api.match(
          { $: 'triggerElement' as const },
          excludePattern,
          $properties.value,
          1,
        ),
      ].flat(),
    ),
  );

  const $timers = computed(() =>
    unique(
      [
        api.match(
          { $: 'offTimer' as const },
          excludePattern,
          $properties.value,
          1,
        ),
        api.match(
          { $: 'automatedInputLogic' as const },
          excludePattern,
          $properties.value,
          1,
        ),
      ].flat(),
    ),
  );

  const $rest = computed(() =>
    exclude(
      $properties.value,
      [$security.value, $lights.value, $scenes.value, $timers.value].flat(),
    ),
  );

  return computed(() => ({
    lights: $lights.value,
    properties: $properties.value,
    rest: $rest.value,
    scenes: $scenes.value,
    security: $security.value,
    sensors: [],
    timers: $timers.value,
  }));
};
