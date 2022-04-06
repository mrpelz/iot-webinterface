import { styled } from 'goober';

export const AlignRight = styled('align-right')`
  display: inline;
  text-align: end;
`;

export const BreakAll = styled('break-all')`
  display: contents;
  word-break: break-all;
  word-break: break-word;
`;

export const NonBreaking = styled('non-breaking')`
  display: contents;
  white-space: nowrap;
`;

export const TabularNums = styled('tabular-nums')`
  display: contents;
  font-variant-numeric: tabular-nums;
`;
