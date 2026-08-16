/* eslint-disable prettier/prettier */
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { colors, dimensions } from '../style.js';
import { breakpointValue } from '../style/breakpoint.js';
import { add, invert } from '../style/dimensions.js';
import { dependentValue, mediaQuery } from '../style/main.js';

export const Titlebar = styled('titlebar')<{ padding: number }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: ${dimensions.titlebarHeight};
  border-block-end: ${dimensions.hairline} solid ${colors.fontTertiary()};
  font-weight: bold;
  padding-inline: ${({ padding }) =>
    add(
      breakpointValue(
        mediaQuery(dimensions.breakpointDesktop),
        dimensions.menuWidth,
        '0px',
      )(),
      `${padding}px`,
    )} ${({ padding }) => `${padding}px`};
  word-break: break-all;
`;

export const Title = styled('h1')`
  overflow: hidden;
  margin: 0;
  color: ${colors.fontPrimary()};
  font-size: ${dimensions.fontSizeLargeAdaptive};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const IconContainer = styled('icon-container' as 'section', forwardRef)<{
  right?: true;
}>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: ${dependentValue('right', 'flex-end', 'flex-start')};
  block-size: 100%;
  color: ${colors.fontPrimary()};
  inset-block-start: 0;

  ${({ right }) => (right ? 'inset-inline-end' : 'inset-inline-start')}: 0;

  & > * {
    min-width: auto;
    padding: ${dimensions.fontPadding};
    block-size: ${dimensions.titlebarHeight};

    & + * {
      margin-inline-start: ${() => invert(dimensions.fontPadding)};
    }
  }
`;
