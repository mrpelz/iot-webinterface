import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

export const SnapStop = styled('snap-stop' as 'section', forwardRef)`
  display: block;
  scroll-snap-align: start;
  scroll-snap-stop: always;
`;
