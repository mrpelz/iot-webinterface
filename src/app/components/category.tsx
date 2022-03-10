import { colors, dimensions } from '../style.js';
import { dependentValue } from '../style/main.js';
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

  background-color: ${dependentValue(
    'isHighContrast',
    colors.backgroundSecondary(),
    colors.backgroundSecondary(80)
  )};
  border-block: ${dependentValue(
    'isHighContrast',
    () => `solid ${dimensions.hairline()} ${colors.fontPrimary()()}`,
    'none'
  )};
  margin-bottom: ${dependentValue(
    'isHighContrast',
    () => `-${dimensions.hairline()}`,
    '0'
  )};
  transform: ${dependentValue(
    'isHighContrast',
    () => `translateY(-${dimensions.hairline()})`,
    'none'
  )};
`;
