import {
  FunctionComponent,
  PreactDOMAttributes,
  h,
  render as preactRender,
} from 'preact';
import { App } from './components/app.js';
import { Flags } from './util/flags.js';
import { I18nProvider } from './hooks/i18n.js';
import { MenuVisibleProvider } from './hooks/menu.js';
import { Notifications } from './util/notifications.js';
import { SelectedPageProvider } from './hooks/selected-page.js';
import { ThemeProvider } from './hooks/theme.js';
import { WebApi } from './web-api.js';
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
    padding: 0;
  }

  :root {
    --safe-area-inset-top: 20px;
  }

  body::-webkit-scrollbar {
    display: none;
  }
`;

const combineComponents = (
  ...components: FunctionComponent[]
): FunctionComponent => {
  return components.reduce(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    (AccumulatedComponents, CurrentComponent) => {
      return ({ children }: PreactDOMAttributes): JSX.Element => {
        return (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      };
    },
    ({ children }) => <>{children}</>
  );
};

export const Root: FunctionComponent<{
  flags: Flags;
  notifications: Notifications;
  webApi: WebApi;
}> = ({ flags, notifications, webApi }) => {
  const NonInteractiveState = combineComponents(
    useInitFlags(flags),
    ThemeProvider,
    I18nProvider
  );

  const InteractiveState = combineComponents(
    useInitWebApi(webApi),
    useInitFallbackNotification(notifications),
    SelectedPageProvider,
    MenuVisibleProvider
  );

  return (
    <NonInteractiveState>
      <GlobalStyles />
      <InteractiveState>
        <App />
      </InteractiveState>
    </NonInteractiveState>
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
