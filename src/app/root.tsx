import {
  FallbackNotificationContext,
  useInitFallbackNotification,
} from './hooks/notification.js';
import { FlagsContext, useInitFlags } from './hooks/flags.js';
import { FunctionComponent, h, render as preactRender } from 'preact';
import { MenuVisibleContext, useInitMenuVisible } from './hooks/menu.js';
import { ThemeContext, useInitTheme } from './hooks/theme.js';
import { WebApiContext, useInitWebApi } from './hooks/web-api.js';
import { App } from './components/app.js';
import { Flags } from './util/flags.js';
import { Notifications } from './util/notifications.js';
import { WebApi } from './web-api.js';
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
  }

  :root,
  body {
    margin: 0;
    padding: 0;
  }

  :root {
    --safe-area-inset-top: 20px;
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
  const initFlags = useInitFlags(flags);
  const initTheme = useInitTheme(initFlags);

  return (
    <FlagsContext.Provider value={initFlags}>
      <ThemeContext.Provider value={initTheme}>
        <GlobalStyles />
        <WebApiContext.Provider value={useInitWebApi(webApi)}>
          <FallbackNotificationContext.Provider
            value={useInitFallbackNotification(notifications)}
          >
            <MenuVisibleContext.Provider value={useInitMenuVisible()}>
              <App />
            </MenuVisibleContext.Provider>
          </FallbackNotificationContext.Provider>
        </WebApiContext.Provider>
      </ThemeContext.Provider>
    </FlagsContext.Provider>
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
