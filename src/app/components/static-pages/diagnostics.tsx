import { colors } from '../../style.js';
import { styled } from 'goober';

export const DiagnosticsContainer = styled('section')`
  background-color: white;
  color: ${colors.black()};
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
  padding: 0.5rem;

  &,
  & * {
    -moz-user-select: text;
    -ms-user-select: text;
    -webkit-tap-highlight-color: text;
    -webkit-touch-callout: text;
    -webkit-user-select: text;
    user-select: text;
    white-space: break-spaces;
    word-break: break-all;
  }

  table,
  td {
    border-collapse: collapse;
    border: 1px solid currentColor;
    vertical-align: top;
  }

  table {
    margin: 0.25rem;
  }

  tr:hover {
    background-color: rgba(0, 0, 0, 0.05);
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
