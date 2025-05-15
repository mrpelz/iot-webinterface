import { ComponentChildren, FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { ShowHide } from '../components/show-hide.js';
import { useScrollRestore } from '../hooks/use-scroll-restore.js';
import { Devices } from '../routes/root/devices.js';
import { Diagnostics } from '../routes/root/diagnostics.js';
import { Global } from '../routes/root/global.js';
import { Room } from '../routes/root/room.js';
import { Settings } from '../routes/root/settings.js';
import { Test } from '../routes/root/test-route.js';
import { noBackground, setBackgroundOverride } from '../state/background.js';
import { $room, $staticPage } from '../state/navigation.js';

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
      return <Room object={room} />;
    }

    return null;
  }, [room, staticPage]);
};

export const SubRoute: FunctionComponent<{
  blackOut?: boolean;
  subRoute: ComponentChildren;
}> = ({ blackOut = true, children, subRoute }) => {
  setBackgroundOverride(subRoute && blackOut ? noBackground : undefined);
  useScrollRestore(!subRoute);

  return (
    <>
      <ShowHide show={!subRoute}>{children}</ShowHide>
      {subRoute ?? null}
    </>
  );
};
