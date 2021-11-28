import { MapIcon, MenuIcon } from './icons.js';
import { colors, dimensions, strings } from '../style.js';
import { useFlipMenuVisible, useIsMenuVisible } from '../hooks/menu.js';
import { Diagnostics } from './static-pages/diagnostics.js';
import { FunctionComponent } from 'preact';
import { Global } from './static-pages/global.js';
import { Layout } from './layout.js';
import { Menu } from './menu.js';
import { Notification } from './notification.js';
import { StatusBar } from './status-bar.js';
import { Titlebar } from './titlebar.js';
import { styled } from 'goober';
import { useBreakpoint } from '../style/breakpoint.js';
import { useEffect } from 'preact/hooks';
import { useMediaQuery } from '../style/main.js';
import { useStaticPage } from '../hooks/navigation.js';

const _App = styled('main')`
  background-color: ${colors.backgroundPrimary()};
  color-scheme: ${strings.colorScheme};
  display: flow-root;
  font-family: ${strings.font};
  font-size: ${dimensions.fontSize};
`;

export const App: FunctionComponent = () => {
  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpoint));

  const backgroundColor = colors.backgroundSecondary()();
  const flipMenuVisible = useFlipMenuVisible();
  const isMenuVisible = useIsMenuVisible();

  const { state: staticPage } = useStaticPage();

  useEffect(() => {
    const { style } = document.documentElement;

    style.backgroundColor = backgroundColor;

    return () => {
      style.backgroundColor = '';
    };
  }, [backgroundColor]);

  useEffect(() => {
    const { style } = document.body;

    style.scrollBehavior = isMenuVisible ? 'auto' : '';

    return () => {
      style.scrollBehavior = '';
    };
  }, [isMenuVisible]);

  return (
    <_App>
      <Layout
        header={
          <>
            <StatusBar />
            <Titlebar
              iconsLeft={
                isDesktop ? [] : [<MenuIcon onClick={flipMenuVisible} />]
              }
              iconsRight={[<MapIcon />]}
            />
            <Notification />
          </>
        }
        aside={<Menu />}
      >
        {staticPage
          ? {
              diagnostics: <Diagnostics />,
              global: <Global />,
              map: null,
              settings: null,
              technical: null,
            }[staticPage]
          : null}
      </Layout>
    </_App>
  );
};
