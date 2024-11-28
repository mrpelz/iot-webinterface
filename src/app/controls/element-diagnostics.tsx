import { FunctionComponent } from 'preact';

import { DiagnosticsContainer } from '../components/diagnostics.js';
// import { Hierarchy } from './diagnostics.js';

export const ElementDiagnostics: FunctionComponent<{
  element: unknown;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
}> = ({ element }) => (
  <DiagnosticsContainer>
    {/* <Hierarchy element={element} /> */}
  </DiagnosticsContainer>
);
