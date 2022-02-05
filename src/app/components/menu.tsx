import { colors, dimensions } from '../style.js';
import { dependentValue } from '../style/main.js';
import { forwardRef } from 'preact/compat';
import { styled } from 'goober';

export const Menu = styled('nav')<{ isVisible: boolean }>`
  background-color: ${colors.backgroundSecondary()};
  border-inline-end: ${dimensions.hairline} solid ${colors.fontTertiary()};
  height: ${dimensions.appHeight};
  overflow-y: auto;
  overscroll-behavior-y: contain;
  padding: ${dimensions.titlebarHeight} 0;
  pointer-events: ${dependentValue('isVisible', 'auto', 'none')};
  scroll-behavior: smooth;
`;

export const MenuContent = styled('ul')`
  display: contents;
`;

export const MenuSubdivision = styled('li')`
  list-style: none;
  margin: 0;
  padding: 0;
  margin-block-end: 1rem;
`;

export const MenuSubdivisionHeader = styled('h2')`
  color: ${colors.fontPrimary()};
  font-size: 0.75rem;
  font-weight: normal;
  margin: 0;
  padding: 0 0.5rem;
  text-transform: uppercase;
`;

export const MenuList = styled('ul')`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const MenuListItem = styled('li', forwardRef)<{
  isActive: boolean;
  isHovered: boolean;
}>`
  background-color: ${(...args) =>
    dependentValue(
      'isActive',
      colors.selection(),
      dependentValue(
        'isHovered',
        colors.fontTertiary(),
        colors.backgroundPrimary()
      )(...args)
    )(...args)};

  border-block-end: ${dimensions.hairline} solid ${colors.fontTertiary()};
  border-block-start: ${dimensions.hairline} solid ${colors.fontTertiary()};
  color: ${dependentValue(
    'isActive',
    colors.backgroundPrimary(),
    colors.fontPrimary()
  )};
  cursor: pointer;
  margin: 0;
  padding: ${dimensions.fontPadding};
  font-size: ${dimensions.fontSize};
  height: ${dimensions.titlebarHeight};
  line-height: ${dimensions.fontSize};

  * + & {
    margin-top: -${dimensions.hairline};
  }
`;
