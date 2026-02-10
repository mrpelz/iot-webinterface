import { computed } from '@preact/signals';
import { ComponentChildren, FunctionComponent } from 'preact';

import { ShowHide } from '../components/show-hide.js';
import { useScrollRestore } from '../hooks/use-scroll-restore.js';
import { Devices } from '../routes/root/devices.js';
import { Diagnostics } from '../routes/root/diagnostics.js';
import { Global } from '../routes/root/global.js';
import { Log } from '../routes/root/log.js';
import { LogicReasoning } from '../routes/root/logic-reasoning.js';
import { Room } from '../routes/root/room.js';
import { Settings } from '../routes/root/settings.js';
import { Test } from '../routes/root/test-route.js';
import { noBackground, useBackgroundOverride } from '../state/background.js';
import { $room, $rooms, $staticPage } from '../state/navigation.js';

export const RootRoute: FunctionComponent = () =>
  computed(() =>
    [
      <ShowHide show={$staticPage.value === 'devices'}>
        <Devices />
      </ShowHide>,
      $staticPage.value === 'diagnostics' ? <Diagnostics /> : null,
      <ShowHide show={$staticPage.value === 'global'}>
        <Global />
      </ShowHide>,
      $staticPage.value === 'log' ? <Log /> : null,
      $staticPage.value === 'logicReasoning' ? <LogicReasoning /> : null,
      $staticPage.value === 'map' ? <Test /> : null,
      $staticPage.value === 'settings' ? <Settings /> : null,
      $rooms.value?.map((room) => (
        <ShowHide show={room === $room.value}>
          <Room room={room} />
        </ShowHide>
      )),
    ].flat(),
  );

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
