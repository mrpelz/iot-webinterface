import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { dimensions } from '../style.js';
import { breakpointValue } from '../style/breakpoint.js';
import { mediaQuery } from '../style/main.js';

export const Background = styled('background' as 'section', forwardRef)`
  display: contents;

  & > * {
    position: fixed;
    z-index: -1;
    overflow: hidden;
    block-size: ${dimensions.appHeightCover};
    inline-size: ${dimensions.appWidth};
    inset-block-start: ${dimensions.headerHeight};
    inset-inline-start: ${breakpointValue(
      mediaQuery(dimensions.breakpointDesktop),
      dimensions.menuWidth,
      'unset',
    )};
    object-fit: cover;
    object-position: center;
  }
`;
