import {
  useNavigationRoom,
  useNavigationStaticPage,
} from '../state/navigation.js';
import { Devices } from './routes/root/devices.js';
import { Diagnostics } from './routes/root/diagnostics.js';
import { FunctionComponent } from 'preact';
import { Global } from './routes/root/global.js';
import { Room } from './routes/root/room.js';
import { Settings } from './routes/root/settings.js';
import { Test } from './routes/root/test.js';
import { useMemo } from 'preact/hooks';

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
