import { FunctionComponent } from 'preact';

import { DiagnosticsContainer } from '../../components/diagnostics.js';
import { LogStream } from '../../views/log-stream.js';

export const LogicReasoning: FunctionComponent = () => (
  <DiagnosticsContainer>
    <LogStream url="/api/logic-reasoning" />
  </DiagnosticsContainer>
);
