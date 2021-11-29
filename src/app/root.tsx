import { FunctionComponent, h, render as preactRender } from 'preact';
import { App } from './components/app.js';
import { Flags } from './util/flags.js';
import { I18nProvider } from './hooks/i18n.js';
import { MenuVisibleProvider } from './hooks/menu.js';
import { NavigationProvider } from './hooks/navigation.js';
import { Notifications } from './util/notifications.js';
import { ThemeProvider } from './hooks/theme.js';
import { WebApi } from './web-api.js';
import { combineComponents } from './util/combine-components.js';
import { createGlobalStyles as createGlobalStyle } from 'goober/global';
import { prefix } from 'goober/prefixer';
import { setup } from 'goober';
import { useInitFallbackNotification } from './hooks/notification.js';
import { useInitFlags } from './hooks/flags.js';
import { useInitWebApi } from './hooks/web-api.js';

const GlobalStyles = createGlobalStyle`
  * {
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    box-sizing: border-box;
    scroll-behavior: smooth;
    scrollbar-width: none;
    user-select: none;
  }

  :root,
  body {
    margin: 0;
    overscroll-behavior-y: none;
    padding: 0;
  }

  :root {
    /* --safe-area-inset-top: 20px; */
  }

  body::-webkit-scrollbar {
    display: none;
  }
`;

export const Root: FunctionComponent<{
  flags: Flags;
  notifications: Notifications;
  webApi: WebApi;
}> = ({ flags, notifications, webApi }) => {
  const OuterState = combineComponents(useInitFlags(flags), ThemeProvider);

  const InnerState = combineComponents(
    useInitWebApi(webApi),
    useInitFallbackNotification(notifications),
    I18nProvider,
    MenuVisibleProvider,
    NavigationProvider
  );

  return (
    <OuterState>
      <GlobalStyles />
      <InnerState>
        <App />
      </InnerState>
    </OuterState>
  );
};

export function render(
  flags: Flags,
  notifications: Notifications,
  webApi: WebApi
): void {
  setup(h, prefix);

  preactRender(
    <Root flags={flags} notifications={notifications} webApi={webApi} />,
    document.body
  );
}
