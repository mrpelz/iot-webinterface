/* eslint-disable prettier/prettier */
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { colors, dimensions, strings } from '../style.js';
import { breakpointValue } from '../style/breakpoint.js';
import { invert } from '../style/dimensions.js';
import { dependentValue, mediaQuery } from '../style/main.js';

export const Header = styled('header')<{
  isVisible: boolean;
}>`
  position: fixed;
  z-index: 4;
  background-color: ${colors.backgroundSecondary()};
  inset-block-start: 0;
  inset-inline: 0;
  touch-action: none;
  transform: ${dependentValue(
    'isVisible',
    'translate3d(0, 0, 0)',
    'translate3d(0, -100%, 0)',
  )};
  transition: transform 0.3s ease-out;
`;

export const Aside = styled('aside', forwardRef)<{
  isVisible: boolean;
}>`
  position: fixed;
  z-index: 4;
  inset-block: ${dimensions.headerHeight} 0;
  inset-inline-start: 0;
  transform: ${dependentValue(
    'isVisible',
    'translate3d(0, 0, 0)',
    'translate3d(-100%, 0, 0)',
  )};
  transition:
    block-size 0.3s ease-out,
    transform 0.3s ease-out,
    inset-block-start 0.3s ease-out;
`;

export const Main = styled('main', forwardRef)<{
  isAsideVisible: boolean;
}>`
  position: relative;
  z-index: 2;
  display: flow-root;
  background-color: ${colors.backgroundPrimary()};
  color: ${colors.fontPrimary()};
  inline-size: ${dimensions.appWidth};
  margin-block: ${dimensions.headerHeight} ${invert(strings.safeAreaInsetBottom)};
  margin-inline-start: ${breakpointValue(
    mediaQuery(dimensions.breakpointDesktop),
    dimensions.menuWidth,
    'unset',
  )};
  min-block-size: ${dimensions.appHeightCover};
  padding-block-end: ${strings.safeAreaInsetBottom};
  scroll-behavior: smooth;
  touch-action: ${dependentValue('isAsideVisible', 'none', 'auto')};
  transition:
    block-size 0.3s ease-out,
    margin-block-start 0.3s ease-out;
`;
