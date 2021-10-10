import { colors, dimensions } from '../style.js';
import { FunctionComponent } from 'preact';
import { Hierarchy } from './hierarchy.js';
import { styled } from 'goober';
import { useBreakpoint } from '../style/breakpoint.js';
import { useFlags } from '../hooks/flags.js';
import { useI18n } from '../hooks/i18n.js';
import { useIsMenuVisible } from '../hooks/menu.js';
import { useMediaQuery } from '../style/main.js';
import { useWebApi } from '../hooks/web-api.js';

const DiagnosticsContainer = styled('section')`
  background-color: white;
  color: ${colors.black()};
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
  height: ${dimensions.appHeight};
  overflow: scroll;
  padding: 0.5rem;
  z-index: 10;

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

export const Diagnostics: FunctionComponent = () => {
  const { hierarchy, streamOnline } = useWebApi();

  const flags = useFlags();
  const menuVisible = useIsMenuVisible();
  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpoint));

  const { country, language, locale, translation, translationLanguage } =
    useI18n();

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

            <table>
              <tr>
                <td>{translationLanguage}</td>
              </tr>
              <tr>
                <td>
                  <pre>{JSON.stringify(translation, undefined, 2)}</pre>
                </td>
              </tr>
            </table>
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
