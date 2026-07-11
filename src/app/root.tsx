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

import { dimensions, strings } from './style.js';
import { App } from './views/app.js';

const GlobalStyles = createGlobalStyle`
  *:not(input, select, button) {
    box-sizing: border-box;
    scrollbar-width: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    -webkit-touch-callout: none;
    user-select: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  :root,
  body {
    padding: 0;
    margin: 0;
  }

  :root {
    display: flow-root;

    /* --safe-area-inset-top: 20px; */
    color-scheme: ${strings.colorScheme};
    font-family: ${strings.font};
    font-size: ${dimensions.fontSize};
    scroll-padding: ${dimensions.headerHeight} 0 0 0;
    scroll-snap-type: block;
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
