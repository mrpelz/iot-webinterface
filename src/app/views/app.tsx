import { FunctionComponent } from 'preact';
import { useLayoutEffect } from 'preact/hooks';

import { App as AppComponent } from '../components/app.js';
import { colors } from '../style.js';
import { flags } from '../util/flags.js';
import { Background } from './background.js';
import { Layout } from './layout.js';
import { RootRoute } from './route.js';
import { Screensaver } from './screensaver.js';

export const App: FunctionComponent = () => {
  const backgroundColor = colors.backgroundPrimary()();

  const { value: isScreensaverEnabled } = flags.screensaverEnable;

  useLayoutEffect(() => {
    const { style } = document.documentElement;

    style.background = backgroundColor;

    return () => {
      style.backgroundColor = '';
    };
  }, [backgroundColor]);

  return (
    <AppComponent>
      {isScreensaverEnabled ? <Screensaver /> : null}
      <Layout>
        <RootRoute />
        <Background />
      </Layout>
    </AppComponent>
  );
};
