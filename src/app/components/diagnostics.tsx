import { colors, dimensions } from '../style.js';
import { staticPages, useNavigation } from '../hooks/navigation.js';
import { FunctionComponent } from 'preact';
import { Hierarchy } from './hierarchy.js';
import { styled } from 'goober';
import { useBreakpoint } from '../style/breakpoint.js';
import { useFlags } from '../hooks/flags.js';
import { useI18n } from '../hooks/i18n.js';
import { useIsMenuVisible } from '../hooks/menu.js';
import { useMediaQuery } from '../style/main.js';
import { useMemo } from 'preact/hooks/src/index.js';
import { useNotification } from '../hooks/notification.js';
import { useTheme } from '../hooks/theme.js';
import { useWebApi } from '../hooks/web-api.js';

const _DiagnosticsContainer = styled('section')`
  background-color: white;
  color: ${colors.black()};
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
  height: ${dimensions.appHeight};
  overflow: scroll;
  padding: 0.5rem;
  z-index: 10;

  &,
  & * {
    -moz-user-select: text;
    -ms-user-select: text;
    -webkit-tap-highlight-color: text;
    -webkit-touch-callout: text;
    -webkit-user-select: text;
    user-select: text;
  }

  table,
  td {
    border-collapse: collapse;
    border: 1px solid currentColor;
    vertical-align: top;
  }

  table {
    margin: 0.25rem;
  }

  tr:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  td {
    padding: 0.25rem;
  }

  thead {
    font-weight: bold;
  }
`;

export const _Summary = styled('summary')`
  cursor: pointer;
`;

export const Diagnostics: FunctionComponent = () => {
  const { hierarchy, streamOnline } = useWebApi();

  const flags = useFlags();
  const menuVisible = useIsMenuVisible();
  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpoint));
  const theme = useTheme();
  const { country, language, locale, translation, translationLanguage } =
    useI18n();
  const fallbackNotification = useNotification();
  const { building, home, room, staticPage } = useNavigation();

  return (
    <_DiagnosticsContainer>
      <table>
        <tr>
          <td>
            <b>stream</b>
          </td>
          <td>{JSON.stringify(streamOnline)}</td>
        </tr>

        <tr>
          <td>
            <b>menu visible</b>
          </td>
          <td>{JSON.stringify(menuVisible)}</td>
        </tr>

        <tr>
          <td>
            <b>isDesktop</b>
          </td>
          <td>{JSON.stringify(isDesktop)}</td>
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
              <_Summary>
                <b>i18n</b>
              </_Summary>

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
              <_Summary>
                <b>flags</b>
              </_Summary>

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
              <_Summary>
                <b>navigation</b>
              </_Summary>

              <table>
                <tr>
                  <td>home</td>
                  <td>
                    <pre>
                      {useMemo(
                        () =>
                          JSON.stringify(
                            {
                              elements: home.elements.map(({ meta }) => meta),
                              state: home.state?.meta,
                            },
                            undefined,
                            2
                          ),
                        [home]
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
                              elements: building.elements.map(
                                ({ meta }) => meta
                              ),
                              state: building.state?.meta,
                            },
                            undefined,
                            2
                          ),
                        [building]
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
                              elements: room.elements.map(
                                ({ elements, floor }) => ({
                                  floor: floor.meta,
                                  rooms: elements.map(({ meta }) => meta),
                                })
                              ),
                              state: room.state?.meta || null,
                            },
                            undefined,
                            2
                          ),
                        [room]
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
                            { elements: staticPages, state: staticPage.state },
                            undefined,
                            2
                          ),
                        [staticPage.state]
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
            <td>
              <details>
                <_Summary>
                  <b>fallback notification</b>
                </_Summary>

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
    </_DiagnosticsContainer>
  );
};
