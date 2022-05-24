import { add, invert } from '../style/dimensions.js';
import { colors, dimensions } from '../style.js';
import { dependentValue, mediaQuery } from '../style/main.js';
import { breakpointValue } from '../style/breakpoint.js';
import { forwardRef } from 'preact/compat';
import { styled } from 'goober';

export const Titlebar = styled('titlebar')<{ padding: number }>`
  align-items: center;
  border-block-end: ${dimensions.hairline} solid ${colors.fontTertiary()};
  display: flex;
  font-weight: bold;
  height: ${dimensions.titlebarHeight};
  justify-content: center;
  position: relative;
  word-break: break-all;

  padding-inline-start: ${({ padding }) =>
    add(
      breakpointValue(
        mediaQuery(dimensions.breakpointDesktop),
        dimensions.menuWidth,
        '0px'
      )(),
      `${padding}px`
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

export const IconContainer = styled('icon-container' as 'div', forwardRef)<{
  right?: true;
}>`
  align-items: center;
  color: ${colors.fontPrimary()};
  display: flex;
  height: 100%;
  justify-content: ${dependentValue('right', 'flex-end', 'flex-start')};
  position: absolute;
  top: 0;

  ${({ right }) => (right ? 'right' : 'left')}: 0;

  & > * {
    height: ${dimensions.titlebarHeight};
    padding: ${dimensions.fontPadding};

    & + * {
      margin-left: ${() => invert(dimensions.fontPadding)};
    }
  }
`;
