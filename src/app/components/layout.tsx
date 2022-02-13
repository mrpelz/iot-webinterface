import { colors, dimensions } from '../style.js';
import { dependentValue, mediaQuery } from '../style/main.js';
import { MenuVisible } from '../state/menu.js';
import { breakpointValue } from '../style/breakpoint.js';
import { forwardRef } from 'preact/compat';
import { styled } from 'goober';

export const Header = styled('header')`
  background-color: ${colors.backgroundSecondary()};
  left: 0;
  position: fixed;
  top: 0;
  touch-action: none;
  width: 100%;
  z-index: 4;
`;

export const Aside = styled('aside', forwardRef)<{
  isVisible: MenuVisible;
  shiftDown: boolean;
}>`
  height: ${dimensions.appHeight};
  left: 0;
  position: fixed;
  transition: height 0.3s ease-out, transform 0.3s ease-out, top 0.3s ease-out;
  width: ${dimensions.menuWidth};
  z-index: 4;

  top: ${dependentValue(
    'shiftDown',
    dimensions.headerHeightShiftDown,
    dimensions.headerHeight
  )};

  transform: ${dependentValue(
    'isVisible',
    'translate3d(0, 0, 0)',
    breakpointValue(
      mediaQuery(dimensions.breakpointDesktop),
      'translate3d(0, 0, 0)',
      'translate3d(-100%, 0, 0)'
    )
  )};
`;

export const Main = styled('article', forwardRef)<{
  isAsideVisible: MenuVisible;
  shiftDown: boolean;
}>`
  background-color: ${colors.backgroundPrimary()};
  color: ${colors.fontPrimary()};
  display: flow-root;
  position: relative;
  touch-action: ${dependentValue('isAsideVisible', 'none', 'auto')};
  transition: height 0.3s ease-out, margin-top 0.3s ease-out;
  width: ${dimensions.appWidth};
  z-index: 2;

  min-height: ${dependentValue(
    'shiftDown',
    dimensions.appHeightShiftDown,
    dimensions.appHeight
  )};

  margin-top: ${dependentValue(
    'shiftDown',
    dimensions.headerHeightShiftDown,
    dimensions.headerHeight
  )};

  margin-left: ${breakpointValue(
    mediaQuery(dimensions.breakpointDesktop),
    dimensions.menuWidth,
    'unset'
  )};
`;
