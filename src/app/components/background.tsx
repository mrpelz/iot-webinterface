import { forwardRef } from 'preact/compat';
import { styled } from 'goober';

export const Background = styled('background' as 'div', forwardRef)`
  display: contents;

  & > * {
    block-size: 100%;
    inline-size: 100%;
    object-fit: cover;
    object-position: center;
    overflow: hidden;
    position: fixed;
    z-index: -1;
  }
`;
