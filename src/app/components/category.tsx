import { styled } from 'goober';

import { colors, dimensions } from '../style.js';
import { dependentValue } from '../style/main.js';

export const CategoryWrapper = styled('category-wrapper')`
  display: flow-root;
  scroll-snap-align: start;
`;

export const CategoryHeader = styled('category-header')<{
  isHighContrast: boolean;
}>`
  position: sticky;
  z-index: 1;
  display: block;
  padding: 0 ${dimensions.fontPadding};
  background-color: ${dependentValue(
    'isHighContrast',
    colors.backgroundSecondary(),
    colors.backgroundSecondary(80),
  )};
  block-size: ${dimensions.fontSizeLarge};
  border-block: ${dependentValue(
    'isHighContrast',
    () => `solid ${dimensions.hairline()} ${colors.fontPrimary()()}`,
    'none',
  )};
  font-size: ${dimensions.fontSizeSmall};
  font-weight: 600;
  inset-block-start: ${dimensions.headerHeight};
  line-height: ${dimensions.fontSizeLarge};
  margin-block-end: ${dependentValue(
    'isHighContrast',
    () => `-${dimensions.hairline()}`,
    '0',
  )};
  transform: ${dependentValue(
    'isHighContrast',
    () => `translateY(-${dimensions.hairline()})`,
    'none',
  )};
  will-change: contents;
`;
