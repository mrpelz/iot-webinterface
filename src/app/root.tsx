import './state/scroll-effects.js';

import { setup } from 'goober';
import { createGlobalStyles as createGlobalStyle } from 'goober/global';
import { prefix } from 'goober/prefixer';
import { FunctionComponent, h, render as preactRender } from 'preact';

import { BackgroundProvider } from './state/background.js';
import { TitleProvider } from './state/title.js';
import { dimensions } from './style.js';
import { combineComponents } from './util/combine-components.js';
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

export const Root: FunctionComponent = () => {
  const State = combineComponents(BackgroundProvider, TitleProvider);

  return (
    <>
      <GlobalStyles />
      <State>
        <App />
      </State>
    </>
  );
};

export const render = (): void => {
  setup(h, prefix);

  preactRender(<Root />, document.body);
};
