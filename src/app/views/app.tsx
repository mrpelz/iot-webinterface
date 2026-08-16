import { FunctionComponent } from 'preact';
import { useLayoutEffect, useRef } from 'preact/hooks';

import { App as AppComponent } from '../components/app.js';
import { colors } from '../style.js';
import { flags$ } from '../util/flags.js';
import { Background } from './background.js';
import { Layout, swipeCaptureWidth } from './layout.js';
import { RootRoute } from './route.js';
import { Screensaver } from './screensaver.js';

export const App: FunctionComponent = () => {
  const appRef = useRef<HTMLElement>(null);

  const backgroundColor = colors.backgroundPrimary()();

  useLayoutEffect(() => {
    const { style } = document.documentElement;

    style.background = backgroundColor;

    return () => {
      style.backgroundColor = '';
    };
  }, [backgroundColor]);

  return (
    <AppComponent
      ref={appRef}
      className="root"
      swipeCaptureWidth={swipeCaptureWidth}
    >
      {flags$.screensaverEnable.value ? <Screensaver /> : null}
      <Layout appRef={appRef}>
        <RootRoute />
        <Background />
      </Layout>
    </AppComponent>
  );
};
