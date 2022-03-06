import { colors, dimensions } from '../style.js';
import { styled } from 'goober';

export const CategoryWrapper = styled('section')`
  display: flow-root;
`;

export const CategoryHeader = styled('header')<{ isHighContrast: boolean }>`
  font-size: ${dimensions.fontSizeSmall};
  font-weight: 600;
  height: ${dimensions.fontSizeLarge};
  line-height: ${dimensions.fontSizeLarge};
  padding: 0 ${dimensions.fontPadding};
  position: sticky;
  top: ${dimensions.headerHeightAdaptive};

  background-color: ${({ isHighContrast }) => {
    return isHighContrast
      ? colors.backgroundSecondary()()
      : colors.backgroundSecondary(80)();
  }};
  border-block: ${({ isHighContrast }) => {
    return isHighContrast
      ? `solid ${dimensions.hairline()} ${colors.fontPrimary()()}`
      : 'none';
  }};
  margin-bottom: ${({ isHighContrast }) => (isHighContrast ? '-1px' : '0')};
  transform: ${({ isHighContrast }) => {
    return isHighContrast ? 'translateY(-1px)' : 'none';
  }};
`;
