import { styled } from 'goober';

export const VisuallyHidden = styled('visually-hidden')`
  &,
  & > * {
    position: absolute;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
    size: 0;
  }
`;
