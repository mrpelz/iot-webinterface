import { forwardRef } from 'preact/compat';
import { styled } from 'goober';

export const SnapStop = styled('snap-stop' as 'section', forwardRef)`
  display: block;
  scroll-snap-align: start;
  scroll-snap-stop: always;
`;
