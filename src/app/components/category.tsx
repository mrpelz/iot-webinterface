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
  block-size: ${dimensions.fontSizeLarge};
  display: block;
  font-size: ${dimensions.fontSizeSmall};
  font-weight: 600;
  inset-block-start: ${dimensions.headerHeight};
  line-height: ${dimensions.fontSizeLarge};
  padding: 0 ${dimensions.fontPadding};
  position: sticky;
  will-change: contents;

  background-color: ${dependentValue(
    'isHighContrast',
    colors.backgroundSecondary(),
    colors.backgroundSecondary(80),
  )};
  border-block: ${dependentValue(
    'isHighContrast',
    () => `solid ${dimensions.hairline()} ${colors.fontPrimary()()}`,
    'none',
  )};
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
`;
