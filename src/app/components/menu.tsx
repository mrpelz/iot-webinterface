import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { colors, dimensions } from '../style.js';
import { breakpointValue } from '../style/breakpoint.js';
import { multiply } from '../style/dimensions.js';
import { dependentValue, mediaQuery } from '../style/main.js';

export const Menu = styled('nav')<{ isVisible: boolean }>`
  /* background-color: ${colors.backgroundSecondary()}; */
  block-size: ${dimensions.appHeightCover};

  /* border-inline-end: ${dimensions.hairline} solid ${colors.fontTertiary()}; */
  inline-size: ${dimensions.menuWidth};
  overflow-y: auto;
  overscroll-behavior-y: contain;
  padding-block: ${dimensions.titlebarHeight};
  padding-inline: 0;
  pointer-events: ${dependentValue('isVisible', 'auto', 'none')};
  scroll-behavior: smooth;
`;

export const MenuShade = styled('menu-shade' as 'section', forwardRef)<{
  active: boolean;
}>`
  position: fixed;
  display: block;
  margin-left: ${breakpointValue(
    mediaQuery(dimensions.breakpointDesktop),
    dimensions.menuWidth,
    'unset',
  )};
  background-color: black;
  block-size: ${dimensions.appHeightCover};
  content: '';
  inline-size: ${dimensions.appWidth};
  inset-block-start: ${dimensions.headerHeight};
  inset-inline-start: 0;
  opacity: ${dependentValue('active', '0.5', '0')};
  pointer-events: ${dependentValue('active', 'all', 'none')};
  transition: opacity 0.3s ease-out;
`;

export const MenuContent = styled('ul')`
  display: contents;
`;

export const MenuSubdivision = styled('li')`
  padding: 0;
  margin: 0;
  list-style: none;

  & + & {
    margin-block-start: 1rem;
  }
`;

export const MenuSubdivisionHeader = styled('h2')`
  padding: 0 0.5rem;
  margin: 0;
  color: ${colors.fontPrimary()};
  font-size: 0.75rem;
  font-weight: normal;
  text-transform: uppercase;
`;

export const MenuList = styled('ul')`
  padding: 0;
  margin: 0;
  list-style: none;
`;

export const MenuListItem = styled('li', forwardRef)<{
  isActive: boolean;
  isHighContrast: boolean;
  isHovered: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${dimensions.fontPadding};
  margin: 0;
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
  block-size: ${dimensions.titlebarHeight};
  border-block-start: ${dimensions.hairline} solid ${colors.fontTertiary()};
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
  cursor: pointer;
  font-size: ${dimensions.fontSize};
  line-height: ${dimensions.fontSize};

  * + & {
    margin-block-start: -${dimensions.hairline};
  }

  &:last-of-type {
    border-block-end: ${dimensions.hairline} solid ${colors.fontTertiary()};
  }
`;

export const MenuIndicatorSection = styled('menu-indicator-section')`
  display: flex;
  gap: ${dimensions.controlBase};
`;

export const MenuIndicatorItem = styled('menu-indicator-item')<{
  color: string;
}>`
  display: block;
  flex-grow: 0;
  flex-shrink: 0;
  border: solid ${dimensions.hairline} ${colors.backgroundPrimary()};
  border-radius: 50%;
  background-color: ${({ color }) => color};
  block-size: ${multiply(dimensions.controlBase, '1.5')};
  inline-size: ${multiply(dimensions.controlBase, '1.5')};
`;
