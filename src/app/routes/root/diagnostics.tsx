import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { DiagnosticsContainer } from '../../components/diagnostics.js';
import { Details, Hierarchy, Meta } from '../../controls/diagnostics.js';
import { useGetLocalStorage } from '../../hooks/use-local-storage.js';
import { useFlags } from '../../state/flags.js';
import { useFocus } from '../../state/focus.js';
import { useI18n } from '../../state/i18n.js';
import { useIsMenuVisible } from '../../state/menu.js';
import {
  staticPagesBottom,
  staticPagesTop,
  useNavigation,
} from '../../state/navigation.js';
import { usePathContext } from '../../state/path.js';
import { useIsScreensaverActive } from '../../state/screensaver.js';
import { useTheme } from '../../state/theme.js';
import { useTitle } from '../../state/title.js';
import { useVisibility } from '../../state/visibility.js';
import {
  useHierarchy,
  useLevelShallow,
  useStreamCount,
  useStreamOnline,
} from '../../state/web-api.js';
import { dimensions } from '../../style.js';
import { useBreakpoint } from '../../style/breakpoint.js';
import { useMediaQuery } from '../../style/main.js';
import { Levels } from '../../web-api.js';

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
              [translationLanguage],
            )}
          </td>
        </tr>
        <tr>
          <td>translationLocale</td>
          <td>
            {useMemo(
              () => JSON.stringify(translationLocale),
              [translationLocale],
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

export const Diagnostics: FunctionComponent = () => {
  const isVisible = useVisibility();

  const isFocused = useFocus();

  const isScreensaverActive = useIsScreensaverActive();

  const { isRoot, path, previousPath } = usePathContext();

  const theme = useTheme();

  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpointDesktop));

  const isStreamOnline = useStreamOnline();
  const streamCount = useStreamCount();

  const hierarchy = useHierarchy();

  const isMenuVisible = useIsMenuVisible();

  const title = useTitle();

  const updateId = useGetLocalStorage('updateId');

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
          <td>
            <b>isFocused</b>
          </td>
          <td>{useMemo(() => JSON.stringify(isFocused), [isFocused])}</td>
        </tr>

        <tr>
          <td>
            <b>isScreensaverActive</b>
          </td>
          <td>
            {useMemo(
              () => JSON.stringify(isScreensaverActive),
              [isScreensaverActive],
            )}
          </td>
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
          <td>
            <b>updateId</b>
          </td>
          <td>{useMemo(() => JSON.stringify(updateId), [updateId])}</td>
        </tr>
      </table>

      {hierarchy ? <Hierarchy element={hierarchy} /> : null}
    </DiagnosticsContainer>
  );
};
