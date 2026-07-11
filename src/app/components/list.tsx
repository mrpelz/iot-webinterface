import { styled } from 'goober';

import { colors, dimensions } from '../style.js';
import { breakpointValue } from '../style/breakpoint.js';
import { double, half, multiply } from '../style/dimensions.js';
import { mediaQuery } from '../style/main.js';

export const List = styled('ul')<{ isHighContrast: boolean }>`
  padding: 0;
  margin: 0 auto;
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
  list-style: none;

  & + & {
    border-block-start: none;
    padding-block-start: ${double(dimensions.fontPadding)};
  }

  &:first-of-type {
    border-block-start: none;
  }

  &:last-of-type {
    border-block-end: none;
  }
`;

export const Entry = styled('li')`
  display: flex;
  justify-content: space-between;
  padding: ${dimensions.fontPadding};
  border-block-end: ${dimensions.hairline} solid ${colors.fontTertiary()};
  font-size: ${dimensions.fontSize};
  gap: 1ch;

  &:last-of-type {
    border-block-end: none;
  }

  & > label,
  & > input {
    cursor: pointer;
  }
`;

export const Button = styled('button')`
  display: block;
  border: ${dimensions.hairline} solid ${colors.fontPrimary()};
  border-radius: ${half(dimensions.controlBase)};
  appearance: none;
  background: none;
  color: ${colors.fontPrimary()};
  cursor: pointer;
  font-size: ${dimensions.fontSizeSmall};
  inline-size: 100%;
  min-block-size: 3em;
  padding-inline: ${dimensions.fontPadding};
`;
