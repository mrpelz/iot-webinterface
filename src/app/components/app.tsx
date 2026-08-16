import { styled } from 'goober';
import { forwardRef } from 'react-dom';

export const App = styled('app' as 'main', forwardRef)<{
  swipeCaptureWidth: number;
}>`
  display: flow-root;
  isolation: isolate;

  &::after {
    position: absolute;
    content: '';
    inline-size: ${({ swipeCaptureWidth }) => `${swipeCaptureWidth}px`};
    inset-block: 0;
    inset-inline-start: 0;
    touch-action: pan-x;
  }
`;
