/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { anyString, excludePattern, Level } from '@iot/iot-monolith/tree';
import { computed } from '@preact/signals';

import { LevelObject } from '../api.js';
import { kitchenAdjacent$ } from '../i18n/mapping.js';
import { api } from '../main.js';
import { excludeById, unique } from '../util/array.js';
import { extractKey } from '../util/oop.js';
import { building$ } from './navigation.js';

export const roomProperties = (room: LevelObject[Level.ROOM]) => {
  const properties$ = computed(() =>
    unique(
      [
        api.match({ $: anyString }, excludePattern, room, 2),
        kitchenAdjacent$.includes(room.$ as (typeof kitchenAdjacent$)[number])
          ? [
              building$.value?.firstFloor.kitchenAdjacentBright,
              building$.value?.firstFloor.kitchenAdjacentChillax,
              building$.value?.firstFloor.kitchenAdjacentLights,
            ]
          : [],
      ].flat(),
    ),
  );

  const lights$ = computed(() =>
    unique(
      [
        extractKey(room, 'allLights'),
        api.match(
          { $: 'outputGrouping' as const, topic: 'lighting' as const },
          excludePattern,
          properties$.value,
          1,
        ),
        api.match(
          { $: 'ledGrouping' as const, topic: 'lighting' as const },
          excludePattern,
          properties$.value,
          1,
        ),
        api.match(
          { $: 'output' as const, topic: 'lighting' as const },
          excludePattern,
          properties$.value,
          1,
        ),
        api.match(
          { $: 'led' as const, topic: 'lighting' as const },
          excludePattern,
          properties$.value,
          1,
        ),
      ].flat(),
    ),
  );

  const scenes$ = computed(() =>
    unique(
      [
        api.match(
          { $: 'scene' as const },
          excludePattern,
          properties$.value,
          1,
        ),
        api.match(
          { $: 'triggerElement' as const },
          excludePattern,
          properties$.value,
          1,
        ),
      ].flat(),
    ),
  );

  const security$ = computed(() =>
    unique(
      [
        extractKey(room, 'entryDoor'),
        extractKey(room, 'door'),
        extractKey(room, 'allWindows'),
        api.match(
          { $: 'window' as const },
          excludePattern,
          properties$.value,
          1,
        ),
        extractKey(room, 'motion'),
      ].flat(),
    ),
  );

  const sensors$ = computed(() =>
    unique(
      [
        extractKey(room, 'temperature'),
        extractKey(room, 'humidity'),
        extractKey(room, 'brightness'),
        extractKey(room, 'co2'),
        extractKey(room, 'tvoc'),
        extractKey(room, 'pm10'),
        extractKey(room, 'pm025'),
        extractKey(room, 'uvIndex'),
        extractKey(room, 'pressure'),
      ].flat(),
    ),
  );

  const timers$ = computed(() =>
    unique(
      [
        api.match(
          { $: 'offTimer' as const },
          excludePattern,
          properties$.value,
          1,
        ),
        api.match(
          { $: 'automatedInputLogic' as const },
          excludePattern,
          properties$.value,
          1,
        ),
      ].flat(),
    ),
  );

  const rest$ = computed(() =>
    excludeById(
      properties$.value,
      [
        lights$.value,
        scenes$.value,
        security$.value,
        sensors$.value,
        timers$.value,
      ].flat(),
    ),
  );

  return computed(() => ({
    lights: lights$.value,
    properties: properties$.value,
    rest: rest$.value,
    scenes: scenes$.value,
    security: security$.value,
    sensors: sensors$.value,
    timers: timers$.value,
  }));
};
