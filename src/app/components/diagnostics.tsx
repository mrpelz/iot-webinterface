import { FunctionComponent } from 'preact';
import { Hierarchy } from './hierarchy.js';
import { styled } from 'goober';
import { useFlags } from '../hooks/flags.js';
import { useWebApi } from '../hooks/web-api.js';

const DiagnosticsContainer = styled('section')`
  background-color: white;
  color: var(--black);
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
