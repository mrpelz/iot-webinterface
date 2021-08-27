import { FlagsContext } from '../util/flags.js';
import { FunctionComponent } from 'preact';
import { Hierarchy } from './hierarchy.js';
import { WebApiContext } from '../web-api/hooks.js';
import { styled } from 'goober';
import { useContext } from 'preact/hooks';

const DiagnosticsContainer = styled('section')`
  background-color: rgba(255, 255, 255, 0.75);
  color: hsl(var(--black));
  display: flex;
  flex-direction: column;
  height: calc(100vh - 2rem);
  overflow: scroll;
  padding: 1rem;
  position: fixed;
  width: calc(100vw - 2rem);

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
  const { hierarchy, streamOnline } = useContext(WebApiContext);

  const flags = useContext(FlagsContext);
  const { debug } = flags;

  return debug ? (
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
  ) : null;
};
