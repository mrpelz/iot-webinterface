import './hooks/use-api.js';
import './state/background.js';
import './state/focus.js';
import './state/menu.js';
import './state/navigation.js';
import './state/path.js';
import './state/screensaver.js';
import './state/scroll-effects.js';
import './state/theme.js';
import './state/translation.js';
import './state/visibility.js';

import { setup } from 'goober';
import { createGlobalStyles as createGlobalStyle } from 'goober/global';
import { prefix } from 'goober/prefixer';
import { FunctionComponent, h, render as preactRender } from 'preact';

import { App } from './views/app.js';

const GlobalStyles = createGlobalStyle`
  /* noop */
` as unknown as FunctionComponent;

export const Root: FunctionComponent = () => (
  <>
    <GlobalStyles />
    <App />
  </>
);

export const render = (): void => {
  setup(h, prefix);

  preactRender(<Root />, document.body);
};
