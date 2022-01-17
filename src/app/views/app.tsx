import {
  Diagnostics,
  DiagnosticsContainer,
  Hierarchy,
} from './static-pages/diagnostics.js';
import { MenuVisible, useIsMenuVisible } from '../state/menu.js';
import { useEffect, useLayoutEffect, useRef } from 'preact/hooks';
import {
  useNavigationRoom,
  useNavigationStaticPage,
} from '../state/navigation.js';
import { App as AppComponent } from '../components/app.js';
import { FunctionComponent } from 'preact';
import { Global } from './static-pages/global.js';
import { Layout } from './layout.js';
import { Settings } from './static-pages/settings.js';
import { Technical } from './static-pages/technical.js';
import { colors } from '../style.js';
import { useI18nKey } from '../state/i18n.js';

export const App: FunctionComponent = () => {
  const backgroundColor = colors.backgroundPrimary()();
  const isMenuVisible = useIsMenuVisible();

  const [staticPage] = useNavigationStaticPage();
  const [room] = useNavigationRoom();

  const isMenuVisibleRef = useRef<MenuVisible>(isMenuVisible);

  const previousScrollY = useRef(0);
  const previousStaticPage = useRef<string | undefined>();
  const previousRoom = useRef<string | undefined>();

  const staticPageName = useI18nKey(staticPage || undefined);
  const roomName = useI18nKey(room?.meta.name);

  useEffect(() => {
    document.title = [staticPageName || roomName, 'wurstsalat IoT'].join(' | ');
  }, [roomName, staticPageName]);

  useLayoutEffect(() => {
    isMenuVisibleRef.current = isMenuVisible;
  }, [isMenuVisible]);

  useLayoutEffect(() => {
    const { style } = document.documentElement;

    style.background = backgroundColor;

    return () => {
      style.backgroundColor = '';
    };
  }, [backgroundColor]);

  useLayoutEffect(() => {
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

    if (!isMenuVisible) {
      previousScrollY.current = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenuVisible]);

  useLayoutEffect(() => {
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

  useLayoutEffect(() => {
    const { style } = document.documentElement;

    return () => {
      style.overflowY = '';
    };
  }, []);

  return (
    <AppComponent>
      <Layout>
        {staticPage
          ? {
              diagnostics: <Diagnostics />,
              global: <Global />,
              map: null,
              settings: <Settings />,
              technical: <Technical />,
            }[staticPage]
          : null}

        {room && !staticPage ? (
          <DiagnosticsContainer>
            <Hierarchy element={room} />
          </DiagnosticsContainer>
        ) : null}
      </Layout>
    </AppComponent>
  );
};
