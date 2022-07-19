import { App as AppComponent } from '../components/app.js';
import { Background } from './background.js';
import { FunctionComponent } from 'preact';
import { Layout } from './layout.js';
import { RootRoute } from './route.js';
import { Screensaver } from './screensaver.js';
import { colors } from '../style.js';
import { useFlag } from '../state/flags.js';
import { useLayoutEffect } from 'preact/hooks';

export const App: FunctionComponent = () => {
  const backgroundColor = colors.backgroundPrimary()();

  const isScreensaverEnabled = useFlag('screensaverEnable');

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
        <Background />
        <RootRoute />
      </Layout>
    </AppComponent>
  );
};
