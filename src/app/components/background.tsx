import { breakpointValue } from '../style/breakpoint.js';
import { dimensions } from '../style.js';
import { forwardRef } from 'preact/compat';
import { mediaQuery } from '../style/main.js';
import { styled } from 'goober';

export const Background = styled('background' as 'section', forwardRef)`
  display: contents;

  & > * {
    block-size: ${dimensions.appHeightAdaptive};
    inline-size: ${dimensions.appWidth};
    inset-block-start: ${dimensions.headerHeightAdaptive};
    object-fit: cover;
    object-position: center;
    overflow: hidden;
    position: fixed;
    z-index: -1;

    inset-inline-start: ${breakpointValue(
      mediaQuery(dimensions.breakpointDesktop),
      dimensions.menuWidth,
      'unset'
    )};
  }
`;
