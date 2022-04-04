import { styled } from 'goober';

export const AlignRight = styled('align-right')`
  display: inline;
  text-align: end;
`;

export const BreakAll = styled('break-all')`
  display: contents;
  hyphens: auto;
  word-break: break-all;
`;

export const NonBreaking = styled('non-breaking')`
  display: contents;
  white-space: nowrap;
`;

export const TabularNums = styled('tabular-nums')`
  display: contents;
  font-variant-numeric: tabular-nums;
`;
