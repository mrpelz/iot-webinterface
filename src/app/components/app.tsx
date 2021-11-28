import { MapIcon, MenuIcon } from './icons.js';
import { add, dimension } from '../style/dimensions.js';
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
  color-scheme: ${strings.colorScheme};
  display: flow-root;
  font-family: ${strings.font};
  font-size: ${dimensions.fontSize};
`;

const _Image = styled('img')`
  height: ${dimension(100)};
  margin-top: ${add(dimensions.headerHeight, dimension(20))};
  object-fit: contain;
  object-position: center;
  position: fixed;
  width: 100vw;
  z-index: 1;
`;

export const App: FunctionComponent = () => {
  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpoint));

  const backgroundColor = colors.backgroundPrimary()();
  const flipMenuVisible = useFlipMenuVisible();
  const isMenuVisible = useIsMenuVisible();

  const { state: staticPage } = useStaticPage();

  useEffect(() => {
    const { style } = document.documentElement;

    style.background = backgroundColor;

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
      <_Image src="/images/icons/ufi.svg" />
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
