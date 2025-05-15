import './state/api.js';
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

import { dimensions } from './style.js';
import { App } from './views/app.js';

const GlobalStyles = createGlobalStyle`
  *:not(input, select, button) {
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    box-sizing: border-box;
    scrollbar-width: none;
    touch-action: manipulation;
    user-select: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  :root,
  body {
    margin: 0;
    padding: 0;
  }

  :root {
    /* --safe-area-inset-top: 20px; */
    scroll-snap-type: block;
    scroll-padding: ${dimensions.headerHeight} 0 0 0;
  }
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
