import {
  excludePattern,
  Level,
  levelObjectMatch,
} from '@iot/iot-monolith/tree';
import { computed } from '@preact/signals';
import { ComponentChildren, FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { ShowHide } from '../components/show-hide.js';
import { useScrollRestore } from '../hooks/use-scroll-restore.js';
import { kitchenAdjacent$ } from '../i18n/mapping.js';
import { api } from '../main.js';
import { Devices } from '../routes/root/devices.js';
import { Diagnostics } from '../routes/root/diagnostics.js';
import { Global } from '../routes/root/global.js';
import { Room } from '../routes/root/room.js';
import { Settings } from '../routes/root/settings.js';
import { Test } from '../routes/root/test-route.js';
import { noBackground, useBackgroundOverride } from '../state/background.js';
import { $building, $room, $staticPage } from '../state/navigation.js';

const $roomProperties = computed(() =>
  api.match(levelObjectMatch[Level.PROPERTY], excludePattern, $room.value, 1),
);

const $kitchenAdjacent = computed(() => {
  if (
    !kitchenAdjacent$.includes(
      $room.value?.$ as (typeof kitchenAdjacent$)[number],
    )
  ) {
    return [];
  }

  return [
    api.match(
      { $: 'outputGrouping' as const, topic: 'lighting' as const },
      excludePattern,
      $building.value,
      2,
    ),
    api.match({ $: 'scene' as const }, excludePattern, $building.value, 2),
    api.match(
      { $: 'triggerElement' as const },
      excludePattern,
      $building.value,
      2,
    ),
  ].flat(1);
});

const $properties = computed(() =>
  [$roomProperties.value, $kitchenAdjacent.value]
    .flat(1)
    .filter((item): item is Exclude<typeof item, undefined> => Boolean(item)),
);

export const RootRoute: FunctionComponent = () => {
  const { value: staticPage } = $staticPage;
  const { value: room } = $room;

  return useMemo(() => {
    if (staticPage) {
      return {
        devices: <Devices />,
        diagnostics: <Diagnostics />,
        global: <Global />,
        map: <Test />,
        settings: <Settings />,
      }[staticPage];
    }

    if (room) {
      return <Room properties={$properties.value} />;
    }

    return null;
  }, [room, staticPage]);
};

export const SubRoute: FunctionComponent<{
  blackOut?: boolean;
  subRoute: ComponentChildren;
}> = ({ blackOut = true, children, subRoute }) => {
  useBackgroundOverride(subRoute && blackOut ? noBackground : undefined);
  useScrollRestore(!subRoute);

  return (
    <>
      <ShowHide show={!subRoute}>{children}</ShowHide>
      {subRoute ?? null}
    </>
  );
};
