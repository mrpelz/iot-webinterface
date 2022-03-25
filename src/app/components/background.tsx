import { forwardRef } from 'preact/compat';
import { styled } from 'goober';

export const Background = styled('background' as 'div', forwardRef)`
  display: contents;

  & > * {
    height: 100%;
    object-fit: cover;
    object-position: center;
    overflow: hidden;
    position: fixed;
    width: 100%;
    z-index: -1;
  }
`;
