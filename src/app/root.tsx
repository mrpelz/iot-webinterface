import { setup } from 'goober';
import { createGlobalStyles as createGlobalStyle } from 'goober/global';
import { prefix } from 'goober/prefixer';
import { FunctionComponent, h, render as preactRender } from 'preact';
import { useMemo } from 'preact/hooks';

import { BackgroundProvider } from './state/background.js';
import { FocusProvider } from './state/focus.js';
import { I18nProvider } from './state/i18n.js';
import { MenuVisibleProvider } from './state/menu.js';
import { NavigationProvider } from './state/navigation.js';
import { PathProvider } from './state/path.js';
import { ScreensaverActiveProvider } from './state/screensaver.js';
import { ScrollEffects } from './state/scroll-effects.js';
import { ThemeProvider } from './state/theme.js';
import { TitleProvider } from './state/title.js';
import { VisibilityProvider } from './state/visibility.js';
import { WebApiProvider } from './state/web-api.js';
import { dimensions } from './style.js';
import { bindComponent, combineComponents } from './util/combine-components.js';
import { $flags } from './util/flags.js';
import { App } from './views/app.js';
import { WebApi } from './web-api.js';

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
  const { apiBaseUrl, debug } = $flags;

  const webApi = useMemo(
    () => new WebApi(apiBaseUrl.value, debug.value),
    [apiBaseUrl.value, debug.value],
  );

  const _PathProvider = bindComponent(
    PathProvider,
    useMemo(() => ({ rootPathDepth: 1 }), []),
  );

  const _WebApiProvider = bindComponent(
    WebApiProvider,
    useMemo(() => ({ webApi }), [webApi]),
  );

  const OuterState = combineComponents(
    VisibilityProvider,
    FocusProvider,
    ScreensaverActiveProvider,
    _PathProvider,
    ThemeProvider,
  );

  const InnerState = combineComponents(
    _WebApiProvider,
    I18nProvider,
    MenuVisibleProvider,
    NavigationProvider,
    BackgroundProvider,
    TitleProvider,
  );

  return (
    <OuterState>
      <GlobalStyles />
      <InnerState>
        <ScrollEffects />
        <App />
      </InnerState>
    </OuterState>
  );
};

export const render = (): void => {
  setup(h, prefix);

  preactRender(<Root />, document.body);
};
