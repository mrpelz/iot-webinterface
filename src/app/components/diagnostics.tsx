import { FunctionComponent } from 'preact';
import { Hierarchy } from './hierarchy.js';
import { colors } from '../style.js';
import { styled } from 'goober';
import { useFlags } from '../hooks/flags.js';
import { useIsMenuVisible } from '../hooks/menu.js';
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

  return (
    <DiagnosticsContainer>
      <table>
        <tr>
          <td>
            <b>Stream</b>
          </td>
          <td>{streamOnline ? 'online' : 'offline'}</td>
        </tr>

        <tr>
          <td>
            <b>Menu visible</b>
          </td>
          <td>{menuVisible ? 'visible' : 'invisible'}</td>
        </tr>

        <tr>
          <td>
            <b>Selected page</b>
          </td>
          <td>{JSON.stringify(selectedPage)}</td>
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
