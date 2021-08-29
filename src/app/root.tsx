import {
  FallbackNotificationContext,
  useInitFallbackNotification,
} from './hooks/notification.js';
import { FlagsContext, useInitFlags } from './hooks/flags.js';
import {
  FunctionComponent,
  createContext,
  h,
  render as preactRender,
} from 'preact';
import { MenuVisibleContext, useInitMenuVisible } from './hooks/menu.js';
import { WebApiContext, useInitWebApi } from './hooks/web-api.js';
import { App } from './components/app.js';
import { Flags } from './util/flags.js';
import { Notifications } from './util/notifications.js';
import { WebApi } from './web-api.js';
import { createGlobalStyles as createGlobalStyle } from 'goober/global';
import { prefix } from 'goober/prefixer';
import { setup } from 'goober';
import { useContext } from 'preact/hooks';

export const defaultTheme = { breakpoint: 'screen and (min-width: 1024px)' };

const ThemeContext = createContext(defaultTheme);
const useTheme = () => useContext(ThemeContext);

const GlobalStyles = createGlobalStyle`
  * {
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
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
    --font: -apple-system, SF UI Text, Helvetica Neue, Helvetica, Arial,
      sans-serif;
    --titlebar-height: 44px;
    --menu-height: 44px;
    --menu-width: 200px;
    --translucent: var(--translucent-override, 0.8);

    --safe-area-inset-top: env(safe-area-inset-top, 20px);
    --safe-area-inset-top: 20px;

    --header-height: calc(var(--safe-area-inset-top) + var(--titlebar-height));
    --header-height-shift-down: calc(var(--header-height) + var(--titlebar-height));
    --app-height: calc(100vh - var(--header-height));
    --app-height-shift-down: calc(var(--app-height) - var(--titlebar-height));

    --app-width: 100vw;
    @media ${({ theme }) => theme.breakpoint} {
      --app-width: calc(100vw - var(--menu-width));
    }

    --hairline: 1px;
    @media (-webkit-min-device-pixel-ratio: 2) {
      --hairline: 0.5px;
    }

    --black-hsl: 0, 0%, 0%;
    --black: hsl(var(--black-hsl));
    --black-translucent: hsla(var(--black-hsl), var(--translucent));

    --white-hsl: 0, 100%, 100%;
    --white: hsl(var(--white-hsl));
    --white-translucent: hsla(var(--white-hsl), var(--translucent));

    --white-shaded-hsl: 240, 7%, 97%;
    --white-shaded: hsl(var(--white-shaded-hsl));
    --white-shaded-translucent: hsla(var(--white-shaded-hsl), var(--translucent));

    --grey-light-hsl: 220, 2%, 76%;
    --grey-light: hsl(var(--grey-light-hsl));
    --grey-light-translucent: hsla(var(--grey-light-hsl), var(--translucent));

    --grey-mid-hsl: 0, 0%, 77%;
    --grey-mid: hsl(var(--grey-mid-hsl));
    --grey-mid-translucent: hsla(var(--grey-mid-hsl), var(--translucent));

    --grey-low-hsl: 0, 0%, 57%;
    --grey-low: hsl(var(--grey-low-hsl));
    --grey-low-translucent: hsla(var(--grey-low-hsl), var(--translucent));

    --blue-hsl: 211, 100%, 50%;
    --blue: hsl(var(--blue-hsl));
    --blue-translucent: hsla(var(--blue-hsl), var(--translucent));

    --black-shaded-hsl: 240, 17%, 9%;
    --black-shaded: hsl(var(--black-shaded-hsl));
    --black-shaded-translucent: hsla(var(--black-shaded-hsl), var(--translucent));

    --grey-dark-hsl: 0, 0%, 26%;
    --grey-dark: hsl(var(--grey-dark-hsl));
    --grey-dark-translucent: hsla(var(--grey-dark-hsl), var(--translucent));

    --grey-glow-hsl: 240, 9%, 23%;
    --grey-glow: hsl(var(--grey-glow-hsl));
    --grey-glow-translucent: hsla(var(--grey-glow-hsl), var(--translucent));

    --orange-hsl: 35, 100%, 50%;
    --orange: hsl(var(--orange-hsl));
    --orange-translucent: hsla(var(--orange-hsl), var(--translucent));

    font-family: var(--font);
    color: var(--white);
  }

  :root.light {
    --background-primary: var(--white);
    --background-secondary: var(--white-shaded);
    --background-tertiary: var(--grey-light);
    --font-primary: var(--black);
    --font-secondary: var(--grey-low);
    --font-tertiary: var(--grey-mid);
    --selection: var(--blue);
    --status-bar-background: var(--black);
  }

  :root.dark {
    --background-primary: var(--black);
    --background-secondary: var(--black-shaded);
    --background-tertiary: var(--black-shaded);
    --font-primary: var(--white);
    --font-secondary: var(--grey-low);
    --font-tertiary: var(--grey-glow);
    --selection: var(--orange);
    --status-bar-background: var(--black-shaded);
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
  return (
    <FlagsContext.Provider value={useInitFlags(flags)}>
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
    </FlagsContext.Provider>
  );
};

export function render(
  flags: Flags,
  notifications: Notifications,
  webApi: WebApi
): void {
  setup(h, prefix, useTheme);

  preactRender(
    <Root flags={flags} notifications={notifications} webApi={webApi} />,
    document.body
  );
}
