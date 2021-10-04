import { colors, dimensions } from '../style.js';
import { useI18n, useI18nLanguage } from '../hooks/i18n.js';
import { FunctionComponent } from 'preact';
import { Hierarchy } from './hierarchy.js';
import { getLocale } from '../util/locale.js';
import { styled } from 'goober';
import { useBreakpoint } from '../style/breakpoint.js';
import { useFlags } from '../hooks/flags.js';
import { useIsMenuVisible } from '../hooks/menu.js';
import { useMediaQuery } from '../style/main.js';
import { useMemo } from 'preact/hooks';
import { useSelectedPage } from '../hooks/selected-page.js';
import { useWebApi } from '../hooks/web-api.js';

const DiagnosticsContainer = styled('section')`
  background-color: white;
  color: ${colors.black()};
  display: flex;
  flex-direction: column;
  overflow-x: scroll;
  padding: 1rem;
  z-index: 10;

  table,
  td {
    border-collapse: collapse;
    border: 1px solid currentColor;
    vertical-align: top;
  }

  table {
    margin: 0.5rem;
  }

  tr:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  td {
    padding: 0.5rem;
  }

  thead {
    font-weight: bold;
  }
`;

export const Diagnostics: FunctionComponent = () => {
  const { hierarchy, streamOnline } = useWebApi();

  const flags = useFlags();
  const menuVisible = useIsMenuVisible();
  const selectedPage = useSelectedPage();
  const i18n = useI18n();
  const i18nLanguage = useI18nLanguage();

  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpoint));

  const { country, language, locale } = useMemo(() => getLocale(), []);

  return (
    <DiagnosticsContainer>
      <table>
        <tr>
          <td>
            <b>Stream</b>
          </td>
          <td>{JSON.stringify(streamOnline)}</td>
        </tr>

        <tr>
          <td>
            <b>Menu visible</b>
          </td>
          <td>{JSON.stringify(menuVisible)}</td>
        </tr>

        <tr>
          <td>
            <b>Selected page</b>
          </td>
          <td>{JSON.stringify(selectedPage)}</td>
        </tr>

        <tr>
          <td>
            <b>isDesktop</b>
          </td>
          <td>{JSON.stringify(isDesktop)}</td>
        </tr>

        <tr>
          <td>
            <b>i18n</b>
          </td>
          <td>
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

            {i18nLanguage ? (
              <table>
                <tr>
                  <td>{i18n}</td>
                </tr>
                <tr>
                  <td>
                    <pre>{JSON.stringify(i18n, undefined, 2)}</pre>
                  </td>
                </tr>
              </table>
            ) : null}
          </td>
        </tr>

        <tr>
          <td>
            <b>Flags</b>
          </td>
          <td>
            <table>
              {Object.entries(flags).map(([key, value]) => (
                <tr>
                  <td>{key}</td>
                  <td>{JSON.stringify(value)}</td>
                </tr>
              ))}
            </table>
          </td>
        </tr>
      </table>
      {hierarchy ? <Hierarchy element={hierarchy} /> : null}
    </DiagnosticsContainer>
  );
};
