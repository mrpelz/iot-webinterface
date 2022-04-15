import {
  useNavigationRoom,
  useNavigationStaticPage,
} from '../state/navigation.js';
import { App as AppComponent } from '../components/app.js';
import { Background } from './background.js';
import { Devices } from './static-pages/devices.js';
import { Diagnostics } from './static-pages/diagnostics.js';
import { FunctionComponent } from 'preact';
import { Global } from './static-pages/global.js';
import { Layout } from './layout.js';
import { Room } from './controls/room.js';
import { Settings } from './static-pages/settings.js';
import { Test } from './controls/test.js';
import { colors } from '../style.js';
import { useLayoutEffect } from 'preact/hooks';

export const App: FunctionComponent = () => {
  const backgroundColor = colors.backgroundPrimary()();

  const [staticPage] = useNavigationStaticPage();
  const [room] = useNavigationRoom();

  useLayoutEffect(() => {
    const { style } = document.documentElement;

    style.background = backgroundColor;

    return () => {
      style.backgroundColor = '';
    };
  }, [backgroundColor]);

  return (
    <AppComponent>
      <Layout>
        <Background />
        {staticPage
          ? {
              devices: <Devices />,
              diagnostics: <Diagnostics />,
              global: <Global />,
              map: <Test />,
              settings: <Settings />,
            }[staticPage]
          : null}

        {room && !staticPage ? <Room element={room} /> : null}
      </Layout>
    </AppComponent>
  );
};
