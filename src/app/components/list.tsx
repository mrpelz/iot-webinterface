import { styled } from 'goober';

import { colors, dimensions } from '../style.js';
import { breakpointValue } from '../style/breakpoint.js';
import { double, half, multiply } from '../style/dimensions.js';
import { mediaQuery } from '../style/main.js';

export const List = styled('ul')<{ isHighContrast: boolean }>`
  list-style: none;
  margin: 0 auto;
  padding: 0;

  border-block: ${() =>
    `solid ${dimensions.hairline()} ${colors.fontTertiary()()}`};
  border-block-end-color: ${colors.fontSecondary()};

  inline-size: ${breakpointValue(
    mediaQuery(dimensions.breakpointTablet),
    () =>
      breakpointValue(
        mediaQuery(dimensions.breakpointHuge),
        () => multiply(dimensions.appWidth(), '1/3'),
        () => half(dimensions.appWidth()),
      )(),
    '100%',
  )};

  &:first-of-type {
    border-block-start: none;
  }

  &:last-of-type {
    border-block-end: none;
  }

  & + & {
    border-block-start: none;
    padding-block-start: ${double(dimensions.fontPadding)};
  }
`;

export const Entry = styled('li')`
  border-block-end: ${dimensions.hairline} solid ${colors.fontTertiary()};
  display: flex;
  font-size: ${dimensions.fontSize};
  gap: 1ch;
  justify-content: space-between;
  padding: ${dimensions.fontPadding};

  &:last-of-type {
    border-block-end: none;
  }
`;

export const Button = styled('button')`
  -webkit-appearance: none;
  appearance: none;
  background: none;
  border-radius: ${half(dimensions.controlBase)};
  border: ${dimensions.hairline} solid ${colors.fontPrimary()};
  color: ${colors.fontPrimary()};
  cursor: pointer;
  display: block;
  font-size: ${dimensions.fontSizeSmall};
  inline-size: 100%;
  min-block-size: 3em;
  padding-inline: ${dimensions.fontPadding};
`;
