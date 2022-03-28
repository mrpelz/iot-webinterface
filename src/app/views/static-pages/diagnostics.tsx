import {
  DiagnosticsContainer,
  Summary,
} from '../../components/controls/diagnostics.js';
import {
  staticPagesBottom,
  staticPagesTop,
  useNavigation,
} from '../../state/navigation.js';
import {
  useHierarchy,
  useLevelShallow,
  useStreamOnline,
} from '../../state/web-api.js';
import { FunctionComponent } from 'preact';
import { Hierarchy } from '../controls/diagnostics.js';
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
import { useVisibility } from '../../state/visibility.js';

export const Diagnostics: FunctionComponent = () => {
  const isStreamOnline = useStreamOnline();

  const { isRoot, path, previousPath } = usePathContext();

  const isMenuVisible = useIsMenuVisible();

  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpointDesktop));

  const isVisible = useVisibility();

  const theme = useTheme();

  // prettier-ignore
  const {
    country,
    language,
    locale,
    translation,
    translationLanguage,
    translationLocale
  } = useI18n();

  const flags = useFlags();

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

  const fallbackNotification = useNotification();

  return (
    <DiagnosticsContainer>
      <table>
        <tr>
          <td>
            <b>stream</b>
          </td>
          <td>{JSON.stringify(isStreamOnline)}</td>
        </tr>

        <tr>
          <td colSpan={999}>
            <b>path</b>

            <table>
              <tr>
                <td>isRoot</td>
                <td>{JSON.stringify(isRoot)}</td>
              </tr>
              <tr>
                <td>path</td>
                <td>{JSON.stringify(path)}</td>
              </tr>
              <tr>
                <td>previousPath</td>
                <td>{JSON.stringify(previousPath)}</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td>
            <b>menu visible</b>
          </td>
          <td>{JSON.stringify(isMenuVisible)}</td>
        </tr>

        <tr>
          <td>
            <b>isDesktop</b>
          </td>
          <td>{JSON.stringify(isDesktop)}</td>
        </tr>

        <tr>
          <td>
            <b>isVisible</b>
          </td>
          <td>{JSON.stringify(isVisible)}</td>
        </tr>

        <tr>
          <td>
            <b>theme</b>
          </td>
          <td>{JSON.stringify(theme)}</td>
        </tr>

        <tr>
          <td colSpan={999}>
            <details>
              <Summary>
                <b>i18n</b>
              </Summary>

              <table>
                <tr>
                  <td>country</td>
                  <td>{JSON.stringify(country)}</td>
                </tr>
                <tr>
                  <td>language</td>
                  <td>{JSON.stringify(language)}</td>
                </tr>
                <tr>
                  <td>locale</td>
                  <td>{JSON.stringify(locale)}</td>
                </tr>
                <tr>
                  <td>translationLanguage</td>
                  <td>{JSON.stringify(translationLanguage)}</td>
                </tr>
                <tr>
                  <td>translationLocale</td>
                  <td>{JSON.stringify(translationLocale)}</td>
                </tr>
              </table>

              <table>
                <tr>
                  <td>{translationLanguage}</td>
                </tr>
                <tr>
                  <td>
                    <pre>
                      {useMemo(
                        () => JSON.stringify(translation, undefined, 2),
                        [translation]
                      )}
                    </pre>
                  </td>
                </tr>
              </table>
            </details>
          </td>
        </tr>

        <tr>
          <td colSpan={999}>
            <details>
              <Summary>
                <b>flags</b>
              </Summary>

              <table>
                {Object.entries(flags).map(([key, value]) => (
                  <tr>
                    <td>{key}</td>
                    <td>{JSON.stringify(value)}</td>
                  </tr>
                ))}
              </table>
            </details>
          </td>
        </tr>

        <tr>
          <td colSpan={999}>
            <details>
              <Summary>
                <b>navigation</b>
              </Summary>

              <table>
                <tr>
                  <td>home</td>
                  <td>
                    <pre>
                      {useMemo(
                        () =>
                          JSON.stringify(
                            {
                              elements: homes.map(({ meta }) => meta),
                              state: home?.meta || null,
                            },
                            undefined,
                            2
                          ),
                        [home, homes]
                      )}
                    </pre>
                  </td>
                </tr>
                <tr>
                  <td>building</td>
                  <td>
                    <pre>
                      {useMemo(
                        () =>
                          JSON.stringify(
                            {
                              elements: buildings.map(({ meta }) => meta),
                              state: building?.meta || null,
                            },
                            undefined,
                            2
                          ),
                        [building, buildings]
                      )}
                    </pre>
                  </td>
                </tr>
                <tr>
                  <td>floor</td>
                  <td>
                    <pre>
                      {useMemo(
                        () =>
                          JSON.stringify(
                            floors.map(({ meta }) => meta),
                            undefined,
                            2
                          ),
                        [floors]
                      )}
                    </pre>
                  </td>
                </tr>
                <tr>
                  <td>room</td>
                  <td>
                    <pre>
                      {useMemo(
                        () =>
                          JSON.stringify(
                            {
                              elements: rooms.map(({ meta }) => meta),
                              state: room?.meta || null,
                            },
                            undefined,
                            2
                          ),
                        [room, rooms]
                      )}
                    </pre>
                  </td>
                </tr>
                <tr>
                  <td>staticPage</td>
                  <td>
                    <pre>
                      {useMemo(
                        () =>
                          JSON.stringify(
                            {
                              elements: {
                                staticPagesBottom,
                                staticPagesTop,
                              },
                              state: staticPage,
                            },
                            undefined,
                            2
                          ),
                        [staticPage]
                      )}
                    </pre>
                  </td>
                </tr>
              </table>
            </details>
          </td>
        </tr>

        {fallbackNotification ? (
          <tr>
            <td colSpan={999}>
              <details>
                <Summary>
                  <b>fallback notification</b>
                </Summary>

                <table>
                  <tr>
                    <td>title</td>
                    <td>{JSON.stringify(fallbackNotification.title)}</td>
                  </tr>
                  <tr>
                    <td>body</td>
                    <td>{JSON.stringify(fallbackNotification.body)}</td>
                  </tr>
                </table>
              </details>
            </td>
          </tr>
        ) : null}
      </table>

      {hierarchy ? <Hierarchy element={hierarchy} /> : null}
    </DiagnosticsContainer>
  );
};
