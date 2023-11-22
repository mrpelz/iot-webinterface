import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { colors, dimensions } from '../style.js';
import { breakpointValue } from '../style/breakpoint.js';
import { multiply } from '../style/dimensions.js';
import { dependentValue, mediaQuery } from '../style/main.js';

export const Menu = styled('nav')<{ isVisible: boolean }>`
  background-color: ${colors.backgroundSecondary()};
  block-size: ${dimensions.appHeight};
  border-inline-end: ${dimensions.hairline} solid ${colors.fontTertiary()};
  inline-size: ${dimensions.menuWidth};
  overflow-y: auto;
  overscroll-behavior-y: contain;
  padding: ${dimensions.titlebarHeight} 0;
  pointer-events: ${dependentValue('isVisible', 'auto', 'none')};
  scroll-behavior: smooth;
`;

export const MenuShade = styled('menu-shade' as 'section', forwardRef)<{
  active: boolean;
}>`
  background-color: black;
  block-size: ${dimensions.appHeight};
  content: '';
  display: block;
  inline-size: ${dimensions.appWidth};
  inset-block-start: ${dimensions.headerHeight};
  inset-inline-start: 0;
  position: fixed;
  transition: opacity 0.3s ease-out;

  margin-left: ${breakpointValue(
    mediaQuery(dimensions.breakpointDesktop),
    dimensions.menuWidth,
    'unset',
  )};
  opacity: ${dependentValue('active', '0.5', '0')};
  pointer-events: ${dependentValue('active', 'all', 'none')};
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
  isHighContrast: boolean;
  isHovered: boolean;
}>`
  align-items: center;
  block-size: ${dimensions.titlebarHeight};
  border-block-end: ${dimensions.hairline} solid ${colors.fontTertiary()};
  border-block-start: ${dimensions.hairline} solid ${colors.fontTertiary()};
  cursor: pointer;
  display: flex;
  font-size: ${dimensions.fontSize};
  justify-content: space-between;
  line-height: ${dimensions.fontSize};
  margin: 0;
  padding: ${dimensions.fontPadding};

  background-color: ${(...args) =>
    dependentValue(
      'isActive',
      colors.selection(),
      dependentValue(
        'isHovered',
        colors.fontTertiary(),
        colors.backgroundPrimary(),
      )(...args),
    )(...args)};
  color: ${(...args) =>
    dependentValue(
      'isActive',
      colors.backgroundPrimary(),
      dependentValue(
        'isHighContrast',
        dependentValue(
          'isHovered',
          colors.backgroundPrimary(),
          colors.fontPrimary(),
        )(...args),
        colors.fontPrimary(),
      )(...args),
    )(...args)};

  * + & {
    margin-block-start: -${dimensions.hairline};
  }
`;

export const MenuIndicatorSection = styled('menu-indicator-section')`
  display: flex;
  gap: ${dimensions.controlBase};
`;

export const MenuIndicatorItem = styled('menu-indicator-item')<{
  color: string;
}>`
  background-color: ${({ color }) => color};
  block-size: ${multiply(dimensions.controlBase, '1.5')};
  border-radius: 50%;
  border: solid ${dimensions.hairline} ${colors.backgroundPrimary()};
  display: block;
  flex-grow: 0;
  flex-shrink: 0;
  inline-size: ${multiply(dimensions.controlBase, '1.5')};
`;
