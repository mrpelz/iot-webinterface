import { colors, dimensions } from '../style.js';
import { add } from '../style/dimensions.js';
import { forwardRef } from 'preact/compat';
import { styled } from 'goober';

export const Titlebar = styled('section')<{ padding: number }>`
  border-block-end: ${dimensions.hairline} solid ${colors.fontTertiary()};
  display: flex;
  font-weight: bold;
  height: ${dimensions.titlebarHeight};
  justify-content: center;
  padding: ${dimensions.fontPadding};
  position: relative;
  word-break: break-all;

  padding-inline: ${({ padding }) =>
    add(dimensions.fontPadding, `${padding}px`)};
`;

export const Title = styled('h1')`
  font-size: ${dimensions.fontSize};
  line-height: ${dimensions.fontSize};
  margin: 0;
  color: ${colors.fontPrimary()};
`;

export const IconContainer = styled('div', forwardRef)<{ right?: true }>`
  display: flex;
  position: absolute;
  color: ${colors.fontPrimary()};
  top: 0;

  ${({ right }) => (right ? 'right' : 'left')}: 0;

  & > * {
    height: ${dimensions.titlebarHeight};
    padding: ${dimensions.fontPadding};
  }
`;
