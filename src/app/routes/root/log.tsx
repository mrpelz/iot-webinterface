import { FunctionComponent } from 'preact';

import { DiagnosticsContainer } from '../../components/diagnostics.js';
import { Tail } from '../../components/tail.js';
import { LogStream } from '../../views/log-stream.js';

export const Log: FunctionComponent = () => (
  <Tail>
    <DiagnosticsContainer>
      <LogStream />
    </DiagnosticsContainer>
  </Tail>
);
