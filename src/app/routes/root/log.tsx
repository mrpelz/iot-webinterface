import { FunctionComponent } from 'preact';

import { DiagnosticsContainer } from '../../components/diagnostics.js';
import { LogStream } from '../../views/log-stream.js';

export const Log: FunctionComponent = () => (
  <DiagnosticsContainer>
    <LogStream url="/api/log" />
  </DiagnosticsContainer>
);
