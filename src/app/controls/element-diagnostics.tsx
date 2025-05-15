import { FunctionComponent } from 'preact';

import { AnyObject } from '../api.js';
import { DiagnosticsContainer } from '../components/diagnostics.js';
import { Hierarchy } from './diagnostics.js';

export const ElementDiagnostics: FunctionComponent<{
  object: AnyObject;
}> = ({ object }) => (
  <DiagnosticsContainer>
    <Hierarchy object={object} />
  </DiagnosticsContainer>
);
