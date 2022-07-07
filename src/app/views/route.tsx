import { ComponentChildren, FunctionComponent } from 'preact';
import { noBackground, useSetBackgroundOverride } from '../state/background.js';
import {
  useNavigationRoom,
  useNavigationStaticPage,
} from '../state/navigation.js';
import { Devices } from '../routes/root/devices.js';
import { Diagnostics } from '../routes/root/diagnostics.js';
import { Global } from '../routes/root/global.js';
import { Room } from '../routes/root/room.js';
import { Settings } from '../routes/root/settings.js';
import { ShowHide } from '../components/show-hide.js';
import { Test } from '../routes/root/test.js';
import { useMemo } from 'preact/hooks';
import { useScrollRestore } from '../hooks/use-scroll-restore.js';

export const RootRoute: FunctionComponent = () => {
  const [staticPage] = useNavigationStaticPage();
  const [room] = useNavigationRoom();

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
      return <Room elements={[room]} />;
    }

    return null;
  }, [room, staticPage]);
};

export const SubRoute: FunctionComponent<{
  blackOut?: boolean;
  subRoute: ComponentChildren;
}> = ({ blackOut = true, children, subRoute }) => {
  useSetBackgroundOverride(subRoute && blackOut ? noBackground : null);
  useScrollRestore(!subRoute);

  return (
    <>
      <ShowHide show={!subRoute}>{children}</ShowHide>
      {subRoute ? subRoute : null}
    </>
  );
};
