import { Match } from '@iot/iot-monolith/tree';
import { FunctionComponent } from 'preact';

import { TSerialization } from '../../common/types.js';
import { DiagnosticsContainer } from '../components/diagnostics.js';
import { Hierarchy } from './diagnostics.js';

export const ElementDiagnostics: FunctionComponent<{
  element: Match<object, TSerialization>;
}> = ({ element }) => (
  <DiagnosticsContainer>
    <Hierarchy object={element} />
  </DiagnosticsContainer>
);
