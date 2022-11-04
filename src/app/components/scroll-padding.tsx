import { colors, dimensions } from '../style.js';
import { forwardRef } from 'preact/compat';
import { styled } from 'goober';

export const ScrollPadding = styled('emoji' as 'section', forwardRef)`
  align-items: center;
  background-color: ${colors.backgroundPrimary()};
  block-size: ${dimensions.headerHeightAdaptive};
  display: flex;
  justify-content: center;
  position: relative;

  &::after {
    content: '☀';
  }
`;
