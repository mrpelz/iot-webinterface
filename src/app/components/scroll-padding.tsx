import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { colors, dimensions } from '../style.js';

export const ScrollPadding = styled('emoji' as 'section', forwardRef)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.backgroundPrimary()};
  block-size: ${dimensions.headerHeight};

  &::after {
    content: '☀';
  }
`;
