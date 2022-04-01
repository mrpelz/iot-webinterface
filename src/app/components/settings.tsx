import { colors, dimensions } from '../style.js';
import { breakpointValue } from '../style/breakpoint.js';
import { mediaQuery } from '../style/main.js';
import { styled } from 'goober';

export const SettingsWrapper = styled('ul')`
  list-style: none;
  margin: ${dimensions.fontPadding} auto;
  padding: 0;

  width: ${breakpointValue(
    mediaQuery(dimensions.breakpointTablet),
    'max-content',
    '100%'
  )};

  input,
  label,
  select {
    -moz-user-select: text;
    -ms-user-select: text;
    -webkit-tap-highlight-color: text;
    -webkit-touch-callout: text;
    -webkit-user-select: text;
    margin-bottom: auto;
    user-select: text;
  }
`;

export const Section = styled('li')`
  border-bottom: ${dimensions.hairline} solid ${colors.fontTertiary()};
  display: flex;
  font-size: ${dimensions.fontSize};
  gap: 1ch;
  justify-content: space-between;
  padding: ${dimensions.fontPadding};

  &:last-of-type {
    border-bottom: none;
  }
`;

export const Button = styled('button')`
  width: 100%;
`;
