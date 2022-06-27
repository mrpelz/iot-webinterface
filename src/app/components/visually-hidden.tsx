import { styled } from 'goober';

export const VisuallyHidden = styled('visually-hidden')`
  &,
  & > * {
    opacity: 0;
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    size: 0;
  }
`;
