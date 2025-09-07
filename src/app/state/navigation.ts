import {
  excludePattern,
  Level,
  levelObjectMatch,
} from '@iot/iot-monolith/tree';
import { computed, effect, signal } from '@preact/signals';

import { api } from '../main.js';
import { $flags } from '../util/flags.js';
import { persistedSignal, promisedSignal, TSignal } from '../util/signal.js';
import { setBackground } from './background.js';
import { $rootPath, setRootPath } from './path.js';
import { $isVisible } from './visibility.js';

/**
 * ROOT
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const $root = promisedSignal(api.isInit.then(() => api.hierarchy));

/**
 * HOMES
 */

export const $homes = computed(() => {
  const root = $root.value;
  if (!root) return undefined;

  return api.match(levelObjectMatch[Level.HOME], excludePattern, root);
});

export type HomeName = Exclude<TSignal<typeof $homes>, undefined>[number]['$'];

const isHomeName = (input?: string): input is HomeName => {
  if (!input) return false;

  const homes_ = $homes.value;
  if (!homes_) return false;

  for (const { $ } of homes_) {
    if (input !== $) continue;
    break;
  }

  return true;
};

const $setHomeName = persistedSignal<HomeName>('$home');

export const setHomeName = (input?: string): void => {
  if (!isHomeName(input)) return;

  $setHomeName.value = input;
};

effect(() => {
  const homes = $homes.value;
  if (!homes) return;
  if ($setHomeName.peek()) return;

  setHomeName(homes.at(0)?.$);
});

export const $homeName = computed(() => {
  const home = $setHomeName.value;
  if (!isHomeName(home)) return undefined;

  return home;
});

export const $home = computed(() => {
  const homes = $homes.value;
  if (!homes) return undefined;

  const $ = $homeName.value;
  if (!$) return undefined;

  for (const home of homes) {
    if ($ === home.$) return home;
  }

  return undefined;
});

/**
 * BUILDINGS
 */

export const $buildings = computed(() => {
  const home = $home.value;
  if (!home) return undefined;

  return api.match(levelObjectMatch[Level.BUILDING], excludePattern, home);
});

export type BuildingName = Exclude<
  TSignal<typeof $buildings>,
  undefined
>[number]['$'];

const isBuildingName = (input?: string): input is BuildingName => {
  if (!input) return false;

  const homes = $homes.value;
  if (!homes) return false;

  for (const { $ } of homes) {
    if (input !== $) continue;
    break;
  }

  return true;
};

const $setBuildingName = persistedSignal<BuildingName>('$building');
export const setBuildingName = (input?: string): void => {
  if (!isBuildingName(input)) return;

  $setBuildingName.value = input;
};

effect(() => {
  const buildings = $buildings.value;
  if (!buildings) return;
  if ($setBuildingName.peek()) return;

  setBuildingName(buildings.at(0)?.$);
});

export const $buildingName = computed(() => {
  const building = $setBuildingName.value;
  if (!isBuildingName(building)) return undefined;

  return building;
});

export const $building = computed(() => {
  const buildings = $buildings.value;
  if (!buildings) return undefined;

  const $ = $buildingName.value;
  if (!$) return undefined;

  for (const building of buildings) {
    if ($ === building.$) return building;
  }

  return undefined;
});

/**
 * FLOORS
 */

export const $floors = computed(() => {
  const building = $building.value;
  if (!building) return undefined;

  return api.match(levelObjectMatch[Level.FLOOR], excludePattern, building);
});

export type FloorName = Exclude<
  TSignal<typeof $floors>,
  undefined
>[number]['$'];

/**
 * ROOMS / STATIC PAGES
 */

export const $rooms = computed(() => {
  const building = $building.value;
  if (!building) return undefined;

  return api.match(levelObjectMatch[Level.ROOM], excludePattern, building);
});

export const staticPagesTop = ['global', 'map'] as const;
export const staticPagesBottom = [
  'devices',
  'settings',
  'diagnostics',
] as const;

export const staticPages = [...staticPagesTop, ...staticPagesBottom];

export type RoomName = Exclude<TSignal<typeof $rooms>, undefined>[number]['$'];

export type StaticPage =
  | (typeof staticPagesTop)[number]
  | (typeof staticPagesBottom)[number];

const START_PAGE: StaticPage = 'global';

const isRoomName = (input?: string): input is RoomName => {
  if (!input) return false;

  const rooms = $rooms.value;
  if (!rooms) return false;

  for (const { $ } of rooms) {
    if (input !== $) continue;
    break;
  }

  return true;
};

const isStaticPage = (input?: string): input is StaticPage => {
  if (!input || !staticPages.includes(input as StaticPage)) {
    return false;
  }

  return true;
};

const $setRootRoute = $flags.pagePersistence.value
  ? persistedSignal('$rootRoute', $rootPath.value ?? START_PAGE)
  : signal($rootPath.value ?? START_PAGE);

const init = () => {
  const startPage = $flags.startPage.value;
  if (startPage) $setRootRoute.value = startPage;

  setRootPath($setRootRoute.value);
};

init();
effect(() => {
  if ($isVisible.value) return;

  init();
});

export const $roomName = computed(() => {
  const room = $setRootRoute.value;
  if (!isRoomName(room)) return undefined;

  return room;
});

export const $room = computed(() => {
  const rooms = $rooms.value;
  if (!rooms) return undefined;

  const $ = $roomName.value;
  if (!$) return undefined;

  for (const room of rooms) {
    if ($ === room.$) return room;
  }

  return undefined;
});

export const $staticPage = computed(() => {
  const staticPage = $setRootRoute.value;
  if (!isStaticPage(staticPage)) return undefined;

  return staticPage;
});

effect(() => {
  const rootPath = $rootPath.value;
  if (!rootPath) return;

  $setRootRoute.value = rootPath;
});

effect(() => {
  setBackground($staticPage.value ?? $roomName.value);
});

effect(() => {
  const root = $root.value;
  const home = $home.value;
  const building = $building.value;
  const room = $room.value;
  const staticPage = $staticPage.value;

  // eslint-disable-next-line no-console
  console.log({
    root,
    // eslint-disable-next-line sort-keys
    home,
    // eslint-disable-next-line sort-keys
    building,
    room,
    staticPage,
  });
});

effect(() => {
  const homes = $homes.value;
  const buildings = $buildings.value;
  const floors = $floors.value;
  const rooms = $rooms.value;

  // eslint-disable-next-line no-console
  console.log({
    homes,
    // eslint-disable-next-line sort-keys
    buildings,
    floors,
    rooms,
    staticPages,
  });
});
