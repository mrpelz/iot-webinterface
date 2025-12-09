import { FunctionComponent } from 'preact';

import { DiagnosticsContainer } from '../../components/diagnostics.js';
import { Tail } from '../../components/tail.js';
import { LogicReasoningStream } from '../../views/logic-reasoning-stream.js';

export const LogicReasoning: FunctionComponent = () => (
  <Tail>
    <DiagnosticsContainer>
      <LogicReasoningStream />
    </DiagnosticsContainer>
  </Tail>
);
