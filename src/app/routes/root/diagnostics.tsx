import { Details, Hierarchy, Meta } from '../../controls/diagnostics.js';
import { ECHO_URL, INVENTORY_URL } from '../../util/update.js';
import {
  staticPagesBottom,
  staticPagesTop,
  useNavigation,
} from '../../state/navigation.js';
import { useFetchJson, useFetchText } from '../../hooks/use-fetch.js';
import {
  useHierarchy,
  useLevelShallow,
  useStreamCount,
  useStreamOnline,
} from '../../state/web-api.js';
import { DiagnosticsContainer } from '../../components/diagnostics.js';
import { FunctionComponent } from 'preact';
import { Levels } from '../../web-api.js';
import { dimensions } from '../../style.js';
import { useBreakpoint } from '../../style/breakpoint.js';
import { useFlags } from '../../state/flags.js';
import { useI18n } from '../../state/i18n.js';
import { useIsMenuVisible } from '../../state/menu.js';
import { useMediaQuery } from '../../style/main.js';
import { useMemo } from 'preact/hooks';
import { useNotification } from '../../state/notification.js';
import { usePathContext } from '../../state/path.js';
import { useTheme } from '../../state/theme.js';
import { useTitle } from '../../state/title.js';
import { useVisibility } from '../../state/visibility.js';

const Fallback: FunctionComponent = () => (
  <tr>
    <td>null</td>
  </tr>
);

const Flags: FunctionComponent = () => {
  const flags = useFlags();

  return (
    <table>
      {Object.entries(flags).map(([key, value]) => (
        <tr>
          <td>{key}</td>
          <td>{JSON.stringify(value)}</td>
        </tr>
      ))}
    </table>
  );
};

const Navigation: FunctionComponent = () => {
  const hierarchy = useHierarchy();

  const {
    building: [building],
    home: [home],
    room: [room],
    staticPage: [staticPage],
  } = useNavigation();

  const homes = useLevelShallow(Levels.HOME, hierarchy);
  const buildings = useLevelShallow(Levels.BUILDING, home);
  const floors = useLevelShallow(Levels.FLOOR, building);
  const rooms = useLevelShallow(Levels.ROOM, building);

  return (
    <table>
      <tr>
        <td>home</td>
        <td>
          <table>
            <tr>
              <td colSpan={999}>elements</td>
            </tr>
            {homes.map((element) => (
              <tr>
                <td>
                  <table>
                    <Meta element={element} />
                  </table>
                </td>
              </tr>
            ))}
          </table>
          <table>
            <tr>
              <td colSpan={999}>state</td>
            </tr>
            {home ? <Meta element={home} /> : <Fallback />}
          </table>
        </td>
      </tr>
      <tr>
        <td>building</td>
        <td>
          <table>
            <tr>
              <td colSpan={999}>elements</td>
            </tr>
            {buildings.map((element) => (
              <tr>
                <td>
                  <table>
                    <Meta element={element} />
                  </table>
                </td>
              </tr>
            ))}
          </table>
          <table>
            <tr>
              <td colSpan={999}>state</td>
            </tr>
            {building ? <Meta element={building} /> : <Fallback />}
          </table>
        </td>
      </tr>
      <tr>
        <td>floor</td>
        <td>
          <table>
            <tr>
              <td colSpan={999}>elements</td>
            </tr>
            {floors.map((element) => (
              <tr>
                <td>
                  <table>
                    <Meta element={element} />
                  </table>
                </td>
              </tr>
            ))}
          </table>
        </td>
      </tr>
      <tr>
        <td>room</td>
        <td>
          <table>
            <tr>
              <td colSpan={999}>elements</td>
            </tr>
            {rooms.map((element) => (
              <tr>
                <td>
                  <table>
                    <Meta element={element} />
                  </table>
                </td>
              </tr>
            ))}
          </table>
          <table>
            <tr>
              <td colSpan={999}>state</td>
            </tr>
            {room ? <Meta element={room} /> : <Fallback />}
          </table>
        </td>
      </tr>
      <tr>
        <td>staticPage</td>
        <td>
          <table>
            <tr>
              <td colSpan={999}>elements</td>
            </tr>
            <tr>
              <td>top</td>
              <td>
                {staticPagesTop.map((page) => (
                  <tr>
                    <td>{JSON.stringify(page)}</td>
                  </tr>
                ))}
              </td>
            </tr>
            <tr>
              <td>bottom</td>
              <td>
                {staticPagesBottom.map((page) => (
                  <tr>
                    <td>{JSON.stringify(page)}</td>
                  </tr>
                ))}
              </td>
            </tr>
          </table>
          <table>
            <tr>
              <td>state</td>
            </tr>
            <tr>
              <td>{useMemo(() => JSON.stringify(staticPage), [staticPage])}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  );
};

const FallbackNotification: FunctionComponent = () => {
  const fallbackNotification = useNotification();

  return (
    <table>
      {fallbackNotification ? (
        <>
          <tr>
            <td>title</td>
            <td>{JSON.stringify(fallbackNotification.title)}</td>
          </tr>
          <tr>
            <td>body</td>
            <td>{JSON.stringify(fallbackNotification.body)}</td>
          </tr>
        </>
      ) : (
        <Fallback />
      )}
    </table>
  );
};

const I18n: FunctionComponent = () => {
  // prettier-ignore
  const {
    country,
    language,
    locale,
    translation,
    translationLanguage,
    translationLocale
  } = useI18n();

  return (
    <>
      <table>
        <tr>
          <td>country</td>
          <td>{useMemo(() => JSON.stringify(country), [country])}</td>
        </tr>
        <tr>
          <td>language</td>
          <td>{useMemo(() => JSON.stringify(language), [language])}</td>
        </tr>
        <tr>
          <td>locale</td>
          <td>{useMemo(() => JSON.stringify(locale), [locale])}</td>
        </tr>
        <tr>
          <td>translationLanguage</td>
          <td>
            {useMemo(
              () => JSON.stringify(translationLanguage),
              [translationLanguage]
            )}
          </td>
        </tr>
        <tr>
          <td>translationLocale</td>
          <td>
            {useMemo(
              () => JSON.stringify(translationLocale),
              [translationLocale]
            )}
          </td>
        </tr>
      </table>

      <table>
        {Object.entries(translation).map(([key, value]) => (
          <tr>
            <td>{key}</td>
            <td>{JSON.stringify(value)}</td>
          </tr>
        ))}
      </table>
    </>
  );
};

const ServiceWorkerInventory: FunctionComponent = () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */

  const { locale } = useI18n();

  const echo = useFetchText(ECHO_URL, 'POST');
  const inventory = useFetchJson(INVENTORY_URL, 'POST');

  const {
    caches = {},
    index: { date = null, index = {} } = {},
    persisted = null,
  } = (inventory as any) || {};

  return (
    <>
      <table>
        <tr>
          <td>handling requests</td>
          <td>{useMemo(() => JSON.stringify(echo === ECHO_URL), [echo])}</td>
        </tr>
        <tr>
          <td>index date</td>
          <td>
            {typeof date === 'number'
              ? new Date(date).toLocaleString(locale || 'en')
              : null}
          </td>
        </tr>
        <tr>
          <td>StorageManager persisted</td>
          <td>{useMemo(() => JSON.stringify(persisted), [persisted])}</td>
        </tr>
      </table>

      <table>
        {Object.entries(index).map(([key, values]) => (
          <>
            <tr>
              <td>
                <b>{key}</b>
              </td>
            </tr>

            {Array.isArray(values)
              ? values.map((value: any) => (
                  <tr>
                    <td>{value}</td>
                  </tr>
                ))
              : null}
          </>
        ))}
      </table>

      <table>
        {Object.entries(caches).map(([key, values]) => (
          <>
            <tr>
              <td colSpan={999}>
                <b>{key}</b>
              </td>
            </tr>

            {((values as any) || []).map((value: any) => (
              <tr>
                <td>{value}</td>
              </tr>
            ))}
          </>
        ))}
      </table>
    </>
  );

  /* eslint-enable @typescript-eslint/no-explicit-any */
};

export const Diagnostics: FunctionComponent = () => {
  const isVisible = useVisibility();

  const { isRoot, path, previousPath } = usePathContext();

  const theme = useTheme();

  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpointDesktop));

  const isStreamOnline = useStreamOnline();
  const streamCount = useStreamCount();

  const hierarchy = useHierarchy();

  const isMenuVisible = useIsMenuVisible();

  const title = useTitle();

  return (
    <DiagnosticsContainer>
      <table>
        <tr>
          <td colSpan={999}>
            <Details summary={<b>flags</b>}>
              <Flags />
            </Details>
          </td>
        </tr>

        <tr>
          <td>
            <b>isVisible</b>
          </td>
          <td>{useMemo(() => JSON.stringify(isVisible), [isVisible])}</td>
        </tr>

        <tr>
          <td colSpan={999}>
            <b>path</b>

            <table>
              <tr>
                <td>isRoot</td>
                <td>{useMemo(() => JSON.stringify(isRoot), [isRoot])}</td>
              </tr>
              <tr>
                <td>path</td>
                <td>{useMemo(() => JSON.stringify(path), [path])}</td>
              </tr>
              <tr>
                <td>previousPath</td>
                <td>
                  {useMemo(() => JSON.stringify(previousPath), [previousPath])}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td>
            <b>theme</b>
          </td>
          <td>{useMemo(() => JSON.stringify(theme), [theme])}</td>
        </tr>

        <tr>
          <td>
            <b>isDesktop</b>
          </td>
          <td>{useMemo(() => JSON.stringify(isDesktop), [isDesktop])}</td>
        </tr>

        <tr>
          <td>
            <b>stream connected</b>
          </td>
          <td>
            {useMemo(() => JSON.stringify(isStreamOnline), [isStreamOnline])}
          </td>
        </tr>

        <tr>
          <td>
            <b>stream client count</b>
          </td>
          <td>{streamCount === null ? null : streamCount}</td>
        </tr>

        <tr>
          <td colSpan={999}>
            <Details summary={<b>navigation</b>}>
              <Navigation />
            </Details>
          </td>
        </tr>

        <tr>
          <td colSpan={999}>
            <Details summary={<b>fallback notification</b>}>
              <FallbackNotification />
            </Details>
          </td>
        </tr>

        <tr>
          <td colSpan={999}>
            <Details summary={<b>i18n</b>}>
              <I18n />
            </Details>
          </td>
        </tr>

        <tr>
          <td>
            <b>menu visible</b>
          </td>
          <td>
            {useMemo(() => JSON.stringify(isMenuVisible), [isMenuVisible])}
          </td>
        </tr>

        <tr>
          <td>
            <b>title</b>
          </td>
          <td>{useMemo(() => JSON.stringify(title), [title])}</td>
        </tr>

        <tr>
          <td colSpan={999}>
            <Details summary={<b>ServiceWorker inventory</b>}>
              <ServiceWorkerInventory />
            </Details>
          </td>
        </tr>
      </table>

      {hierarchy ? <Hierarchy element={hierarchy} /> : null}
    </DiagnosticsContainer>
  );
};
