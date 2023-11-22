import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { dimensions } from '../style.js';
import { breakpointValue } from '../style/breakpoint.js';
import { mediaQuery } from '../style/main.js';

export const Background = styled('background' as 'section', forwardRef)`
  display: contents;

  & > * {
    block-size: ${dimensions.appHeight};
    inline-size: ${dimensions.appWidth};
    inset-block-start: ${dimensions.headerHeight};
    object-fit: cover;
    object-position: center;
    overflow: hidden;
    position: fixed;
    z-index: -1;

    inset-inline-start: ${breakpointValue(
      mediaQuery(dimensions.breakpointDesktop),
      dimensions.menuWidth,
      'unset',
    )};
  }
`;
