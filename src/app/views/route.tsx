import { computed } from '@preact/signals';
import { ComponentChildren, FunctionComponent } from 'preact';

import { ShowHide } from '../components/show-hide.js';
import { useScrollRestore } from '../hooks/use-scroll-restore.js';
import { globalProperties } from '../state/global-properties.js';
import { room$, rooms$, staticPage$ } from '../state/navigation.js';
import { roomProperties } from '../state/room-properties.js';
import { Devices } from './routes/root/devices.js';
import { Diagnostics } from './routes/root/diagnostics.js';
import { Global } from './routes/root/global.js';
import { Log } from './routes/root/log.js';
import { LogicReasoning } from './routes/root/logic-reasoning.js';
import { Room } from './routes/root/room.js';
import { Settings } from './routes/root/settings.js';
import { Test } from './routes/root/test-route.js';

export const RootRoute: FunctionComponent = () => {
  const globalProperties$ = globalProperties();

  const roomProperties$ = computed(() => {
    const { value: rooms } = rooms$;
    if (!rooms) return undefined;

    return Object.fromEntries(
      rooms.map((room) => [room.$, roomProperties(room)] as const),
    ) as Record<(typeof rooms)[number]['$'], ReturnType<typeof roomProperties>>;
  });

  return computed(() => {
    switch (staticPage$.value) {
      case 'global': {
        return <Global properties$={globalProperties$} />;
      }
      case 'map': {
        return <Test />;
      }
      case 'devices': {
        return <Devices />;
      }
      case 'settings': {
        return <Settings />;
      }
      case 'diagnostics': {
        return <Diagnostics />;
      }
      case 'logicReasoning': {
        return <LogicReasoning />;
      }
      case 'log': {
        return <Log />;
      }
      default: {
        return room$.value && roomProperties$.value ? (
          <Room properties$={roomProperties$.value[room$.value.$]} />
        ) : null;
      }
    }
  });
};

export const SubRoute: FunctionComponent<{
  subRoute: ComponentChildren;
}> = ({ children, subRoute }) => {
  useScrollRestore(!subRoute);

  return (
    <>
      <ShowHide show={!subRoute}>{children}</ShowHide>
      {subRoute ?? null}
    </>
  );
};
