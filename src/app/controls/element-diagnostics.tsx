import { DiagnosticsContainer } from '../components/diagnostics.js';
import { FunctionComponent } from 'preact';
import { Hierarchy } from './diagnostics.js';
import { HierarchyElement } from '../web-api.js';

export const ElementDiagnostics: FunctionComponent<{
  element: HierarchyElement;
}> = ({ element }) => (
  <DiagnosticsContainer>
    <Hierarchy element={element} />
  </DiagnosticsContainer>
);
