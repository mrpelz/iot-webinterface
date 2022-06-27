import { App as AppComponent } from '../components/app.js';
import { Background } from './background.js';
import { FunctionComponent } from 'preact';
import { Layout } from './layout.js';
import { RootRoute } from './route.js';
import { colors } from '../style.js';
import { useLayoutEffect } from 'preact/hooks';

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
    <AppComponent>
      <Layout>
        <Background />
        <RootRoute />
      </Layout>
    </AppComponent>
  );
};
