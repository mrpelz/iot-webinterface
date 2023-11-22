import { FunctionComponent } from 'preact';

import { DiagnosticsContainer } from '../components/diagnostics.js';
import { HierarchyElement } from '../web-api.js';
import { Hierarchy } from './diagnostics.js';

export const ElementDiagnostics: FunctionComponent<{
  element: HierarchyElement;
}> = ({ element }) => (
  <DiagnosticsContainer>
    <Hierarchy element={element} />
  </DiagnosticsContainer>
);
