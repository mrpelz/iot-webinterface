import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { colors, dimensions } from '../style.js';

export const ScrollPadding = styled('emoji' as 'section', forwardRef)`
  align-items: center;
  background-color: ${colors.backgroundPrimary()};
  block-size: ${dimensions.headerHeight};
  display: flex;
  justify-content: center;
  position: relative;

  &::after {
    content: '☀';
  }
`;
