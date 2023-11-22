import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { colors, dimensions } from '../style.js';
import { breakpointValue } from '../style/breakpoint.js';
import { add, invert } from '../style/dimensions.js';
import { dependentValue, mediaQuery } from '../style/main.js';

export const Titlebar = styled('titlebar')<{ padding: number }>`
  align-items: center;
  block-size: ${dimensions.titlebarHeight};
  border-block-end: ${dimensions.hairline} solid ${colors.fontTertiary()};
  display: flex;
  font-weight: bold;
  justify-content: center;
  position: relative;
  word-break: break-all;

  padding-inline-start: ${({ padding }) =>
    add(
      breakpointValue(
        mediaQuery(dimensions.breakpointDesktop),
        dimensions.menuWidth,
        '0px',
      )(),
      `${padding}px`,
    )};
  padding-inline-end: ${({ padding }) => `${padding}px`};
`;

export const Title = styled('h1')`
  color: ${colors.fontPrimary()};
  font-size: ${dimensions.fontSizeLargeAdaptive};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const IconContainer = styled('icon-container' as 'section', forwardRef)<{
  right?: true;
}>`
  align-items: center;
  block-size: 100%;
  color: ${colors.fontPrimary()};
  display: flex;
  inset-block-start: 0;
  justify-content: ${dependentValue('right', 'flex-end', 'flex-start')};
  position: absolute;

  ${({ right }) => (right ? 'inset-inline-end' : 'inset-inline-start')}: 0;

  & > * {
    block-size: ${dimensions.titlebarHeight};
    padding: ${dimensions.fontPadding};

    & + * {
      margin-inline-start: ${() => invert(dimensions.fontPadding)};
    }
  }
`;
