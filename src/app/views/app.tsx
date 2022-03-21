import { Diagnostics, Hierarchy } from './static-pages/diagnostics.js';
import { MenuVisible, useIsMenuVisible } from '../state/menu.js';
import { useEffect, useLayoutEffect, useRef } from 'preact/hooks';
import {
  useNavigationRoom,
  useNavigationStaticPage,
} from '../state/navigation.js';
import { App as AppComponent } from '../components/app.js';
import { Background } from './background.js';
import { Devices } from './static-pages/devices.js';
import { DiagnosticsContainer } from '../components/static-pages/diagnostics.js';
import { FunctionComponent } from 'preact';
import { Global } from './static-pages/global.js';
import { Layout } from './layout.js';
import { Settings } from './static-pages/settings.js';
import { colors } from '../style.js';
import { useI18nKey } from '../state/i18n.js';
import { useSegment } from '../state/path.js';

const Test: FunctionComponent = () => {
  const [route1, setRoute1] = useSegment(1);
  const [route2, setRoute2] = useSegment(2);

  return (
    <>
      <button
        disabled={!setRoute1}
        onClick={() =>
          setRoute1?.(Math.round(Math.random() * 10 ** 16).toString(16))
        }
      >
        {route1 || '<none>'}
      </button>
      <br />
      <button disabled={!route1} onClick={() => setRoute1?.(null)}>
        reset
      </button>
      <br />
      <br />
      <button
        disabled={!setRoute2}
        onClick={() =>
          setRoute2?.(Math.round(Math.random() * 10 ** 16).toString(16))
        }
      >
        {route2 || '<none>'}
      </button>
      <br />
      <button disabled={!route2} onClick={() => setRoute2?.(null)}>
        reset
      </button>
    </>
  );
};

export const App: FunctionComponent = () => {
  const backgroundColor = colors.backgroundPrimary()();
  const isMenuVisible = useIsMenuVisible();

  const [staticPage] = useNavigationStaticPage();
  const [room] = useNavigationRoom();

  const isMenuVisibleRef = useRef<MenuVisible>(isMenuVisible);

  const previousPage = useRef<string | undefined>();
  const previousScrollY = useRef(0);

  const staticPageName = useI18nKey(staticPage || undefined);
  const roomName = useI18nKey(room?.meta.name);

  useEffect(() => {
    document.title = [staticPageName || roomName, 'wurstsalat IoT']
      .filter(Boolean)
      .join(' | ');
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

    const currentPage = room?.meta.name || staticPage || undefined;

    scrollTo({
      behavior: 'instant' as ScrollBehavior,
      top:
        !isMenuVisible && previousPage.current !== currentPage
          ? 0
          : previousScrollY.current,
    });

    if (!isMenuVisible) {
      previousPage.current = currentPage;
      previousScrollY.current = 0;
    }
  }, [isMenuVisible, room, staticPage]);

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
        <Background />
        {staticPage
          ? {
              devices: <Devices />,
              diagnostics: <Diagnostics />,
              global: <Global />,
              map: <Test />,
              settings: <Settings />,
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
