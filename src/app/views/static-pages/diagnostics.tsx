import {
  DiagnosticsContainer,
  Summary,
} from '../../components/controls/diagnostics.js';
import { ECHO_URL, INVENTORY_URL } from '../../util/update.js';
import { Hierarchy, Meta } from '../controls/diagnostics.js';
import {
  staticPagesBottom,
  staticPagesTop,
  useNavigation,
} from '../../state/navigation.js';
import { useFetchJson, useFetchText } from '../../util/use-fetch.js';
import {
  useHierarchy,
  useLevelShallow,
  useStreamOnline,
} from '../../state/web-api.js';
import { FunctionComponent } from 'preact';
import { Levels } from '../../web-api.js';
import { dimensions } from '../../style.js';
import { useBreakpoint } from '../../style/breakpoint.js';
import { useFlags } from '../../state/flags.js';
import { useI18n } from '../../state/i18n.js';
import { useIsMenuVisible } from '../../state/menu.js';
import { useMediaQuery } from '../../style/main.js';
import { useNotification } from '../../state/notification.js';
import { usePathContext } from '../../state/path.js';
import { useTheme } from '../../state/theme.js';
import { useVisibility } from '../../state/visibility.js';

const Fallback: FunctionComponent = () => (
  <tr>
    <td>null</td>
  </tr>
);

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

  const echo = useFetchText(ECHO_URL, 'POST');
  const inventory = useFetchJson(INVENTORY_URL, 'POST');

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
                {Object.entries(translation).map(([key, value]) => (
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
                    <table>
                      <tr>
                        <td colSpan={999}>elements</td>
                      </tr>
                      {homes.map((element) => (
                        <Meta element={element} />
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
                        <Meta element={element} />
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
                        <Meta element={element} />
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
                        <Meta element={element} />
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
                        <td>{JSON.stringify(staticPage)}</td>
                      </tr>
                    </table>
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
                <b>fallback notification</b>
              </Summary>

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
            </details>
          </td>
        </tr>

        <tr>
          <td colSpan={999}>
            <details>
              <Summary>
                <b>ServiceWorker inventory</b>
              </Summary>

              <table>
                <tr>
                  <td>handling requests</td>
                  <td>{JSON.stringify(echo === ECHO_URL)}</td>
                </tr>
              </table>

              <pre>{JSON.stringify(inventory, undefined, 2)}</pre>
            </details>
          </td>
        </tr>
      </table>

      {hierarchy ? <Hierarchy element={hierarchy} /> : null}
    </DiagnosticsContainer>
  );
};
