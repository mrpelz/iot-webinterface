import { MapIcon, MenuIcon } from './icons.js';
import { colors, dimensions, strings } from '../style.js';
import { useFlipMenuVisible, useIsMenuVisible } from '../hooks/menu.js';
import { useRoom, useStaticPage } from '../hooks/navigation.js';
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

const _App = styled('main')`
  color-scheme: ${strings.colorScheme};
  display: flow-root;
  font-family: ${strings.font};
  font-size: ${dimensions.fontSize};
`;

let previousScrollY = 0;
let previousStaticPage: string | undefined;
let previousRoom: string | undefined;

export const App: FunctionComponent = () => {
  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpoint));

  const backgroundColor = colors.backgroundPrimary()();
  const flipMenuVisible = useFlipMenuVisible();
  const isMenuVisible = useIsMenuVisible();

  const { state: staticPage } = useStaticPage();
  const { state: room } = useRoom();

  useEffect(() => {
    const { style } = document.documentElement;

    style.background = backgroundColor;

    return () => {
      style.backgroundColor = '';
    };
  }, [backgroundColor]);

  useEffect(() => {
    const { style } = document.documentElement;

    if (isMenuVisible) {
      previousScrollY = scrollY;
    }

    style.top = isMenuVisible ? `-${scrollY}px` : '';
    style.position = isMenuVisible ? 'fixed' : '';

    if (!isMenuVisible) {
      scrollTo({
        behavior: 'instant' as ScrollBehavior,
        top:
          staticPage !== previousStaticPage || room?.meta.name !== previousRoom
            ? 0
            : previousScrollY,
      });
    }

    previousStaticPage = staticPage || undefined;
    previousRoom = room?.meta.name;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenuVisible]);

  useEffect(() => {
    const { style } = document.body;

    return () => {
      style.top = '';
      style.position = '';

      previousScrollY = 0;
      previousStaticPage = undefined;
      previousRoom = undefined;
    };
  }, []);

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
