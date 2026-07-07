import { App as AppComponent } from 'konsta/react';
import { FunctionComponent } from 'preact';
import { useLayoutEffect } from 'preact/hooks';

import { colors } from '../style.js';
import { flags$ } from '../util/flags.js';
import { Background } from './background.js';
import { Layout } from './layout.js';
import { RootRoute } from './route.js';
import { Screensaver } from './screensaver.js';

export const App: FunctionComponent = () => {
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
      dark
      theme="ios"
    >
      {flags$.screensaverEnable.value ? <Screensaver /> : null}
      <Layout>
        <RootRoute />
        <Background />
      </Layout>
    </AppComponent>
  );
};
