import { styled } from 'goober';

import { colors } from '../style.js';

export const DiagnosticsContainer = styled('diagnostics-container')`
  display: flex;
  flex-direction: column;
  background-color: ${colors.backgroundSecondary()};
  color: ${colors.fontSecondary()};
  font-size: 0.75rem;

  &,
  & * {
    -webkit-tap-highlight-color: currentcolor;
    -webkit-touch-callout: none;
    user-select: text;
    white-space: break-spaces;
    word-break: break-all;
  }

  table,
  td {
    border: 1px solid currentcolor;
    border-collapse: collapse;
    vertical-align: top;
  }

  table {
    margin: 0.25rem;
  }

  td {
    padding: 0.25rem;
  }

  thead {
    font-weight: bold;
  }
`;

export const Summary = styled('summary')`
  cursor: pointer;
`;

export const Pre = styled('pre')`
  margin: 0;
`;
