import { ComponentChildren, FunctionComponent } from 'preact';
import { noBackground, useSetBackgroundOverride } from '../state/background.js';
import { useEffect, useMemo } from 'preact/hooks';
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
import { useScrollRestore } from '../hooks/use-scroll-restore.js';
import { useSetTitleOverride } from '../state/title.js';

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
      return <Room element={room} />;
    }

    return null;
  }, [room, staticPage]);
};

export const SubRoute: FunctionComponent<{
  blackOut?: boolean;
  subRoute: ComponentChildren;
  title?: string;
}> = ({ blackOut = true, children, subRoute, title }) => {
  const isSubRoute = subRoute && title;

  const setTitleOverride = useSetTitleOverride();
  const setBackgroundOverride = useSetBackgroundOverride();

  useEffect(() => {
    setTitleOverride(isSubRoute ? title : null);

    return () => setTitleOverride(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubRoute, title]);

  useEffect(() => {
    setBackgroundOverride(isSubRoute && blackOut ? noBackground : null);

    return () => setBackgroundOverride(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blackOut, isSubRoute]);

  useScrollRestore(!isSubRoute);

  return (
    <>
      <ShowHide show={!isSubRoute}>{children}</ShowHide>
      {subRoute}
    </>
  );
};
