import { colors, dimensions } from '../style.js';
import { styled } from 'goober';

export const SettingsWrapper = styled('ul')`
  list-style: none;
  margin: ${dimensions.fontPadding} auto;
  max-width: max-content;
  padding: 0;

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
