import { MapIcon, MenuIcon } from './icons.js';
import {
  MenuVisible,
  useFlipMenuVisible,
  useIsMenuVisible,
} from '../hooks/menu.js';
import { colors, dimensions, strings } from '../style.js';
import { useEffect, useRef } from 'preact/hooks';
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
import { useMediaQuery } from '../style/main.js';

const _App = styled('main')`
  color-scheme: ${strings.colorScheme};
  display: flow-root;
  font-family: ${strings.font};
  font-size: ${dimensions.fontSize};
`;

export const App: FunctionComponent = () => {
  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpoint));

  const backgroundColor = colors.backgroundPrimary()();
  const flipMenuVisible = useFlipMenuVisible();
  const isMenuVisible = useIsMenuVisible();

  const { state: staticPage } = useStaticPage();
  const { state: room } = useRoom();

  const isMenuVisibleRef = useRef<MenuVisible>(isMenuVisible);

  const previousScrollY = useRef(0);
  const previousStaticPage = useRef<string | undefined>();
  const previousRoom = useRef<string | undefined>();

  useEffect(() => {
    isMenuVisibleRef.current = isMenuVisible;
  }, [isMenuVisible]);

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
      previousScrollY.current = scrollY;
    }

    style.overflowY = isMenuVisible ? 'hidden' : '';

    scrollTo({
      behavior: 'instant' as ScrollBehavior,
      top:
        !isMenuVisible &&
        (staticPage !== previousStaticPage.current ||
          room?.meta.name !== previousRoom.current)
          ? 0
          : previousScrollY.current,
    });

    previousStaticPage.current = staticPage || undefined;
    previousRoom.current = room?.meta.name;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenuVisible]);

  useEffect(() => {
    const onScroll: (
      this: HTMLElement,
      event: HTMLElementEventMap['scroll']
    ) => void = () => {
      if (!isMenuVisibleRef.current) return;

      scrollTo({
        behavior: 'instant' as ScrollBehavior,
        top: previousScrollY.current,
      });
    };

    document.addEventListener('scroll', onScroll);

    return () => {
      document.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const { style } = document.documentElement;

    return () => {
      style.overflowY = '';
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
