import { FunctionComponent, h, render as preactRender } from 'preact';
import { bindComponent, combineComponents } from './util/combine-components.js';
import { App } from './views/app.js';
import { FallbackNotificationProvider } from './hooks/notification.js';
import { FlagProvider } from './hooks/flags.js';
import { Flags } from './util/flags.js';
import { I18nProvider } from './hooks/i18n.js';
import { MenuVisibleProvider } from './hooks/menu.js';
import { NavigationProvider } from './hooks/navigation.js';
import { Notifications } from './util/notifications.js';
import { ThemeProvider } from './hooks/theme.js';
import { VisibilityProvider } from './hooks/visibility.js';
import { WebApi } from './web-api.js';
import { WebApiProvider } from './hooks/web-api.js';
import { createGlobalStyles as createGlobalStyle } from 'goober/global';
import { prefix } from 'goober/prefixer';
import { setup } from 'goober';

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

    &::-webkit-scrollbar {
      display: none;
    }
  }

  :root,
  body {
    margin: 0;
    overflow-x: hidden;
    overscroll-behavior-y: none;
    padding: 0;
  }

  :root {
    /* --safe-area-inset-top: 20px; */
  }
`;

export const Root: FunctionComponent<{
  flags: Flags;
  notifications: Notifications;
  webApi: WebApi;
}> = ({ flags, notifications, webApi }) => {
  const _FlagProvider = bindComponent(FlagProvider, { flags });
  const _WebApiProvider = bindComponent(WebApiProvider, { webApi });
  const _FallbackNotificationProvider = bindComponent(
    FallbackNotificationProvider,
    { notifications }
  );

  const OuterState = combineComponents(
    VisibilityProvider,
    _FlagProvider,
    ThemeProvider
  );

  const InnerState = combineComponents(
    _WebApiProvider,
    _FallbackNotificationProvider,
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
