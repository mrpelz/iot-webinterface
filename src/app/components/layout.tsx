import { colors, dimensions } from '../style.js';
import { dependentValue, mediaQuery } from '../style/main.js';
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
  isVisible: boolean;
}>`
  height: ${dimensions.appHeight};
  left: 0;
  position: fixed;
  top: ${dimensions.headerHeightAdaptive};
  transition: height 0.3s ease-out, transform 0.3s ease-out, top 0.3s ease-out;
  z-index: 4;

  transform: ${dependentValue(
    'isVisible',
    'translate3d(0, 0, 0)',
    'translate3d(-100%, 0, 0)'
  )};
`;

export const Main = styled('main', forwardRef)<{
  isAsideVisible: boolean;
  swipeCaptureWidth: number;
}>`
  background-color: ${colors.backgroundPrimary()};
  color: ${colors.fontPrimary()};
  display: flow-root;
  margin-top: ${dimensions.headerHeightAdaptive};
  min-height: ${dimensions.appHeightAdaptive};
  position: relative;
  touch-action: ${dependentValue('isAsideVisible', 'none', 'auto')};
  transition: height 0.3s ease-out, margin-top 0.3s ease-out;
  width: ${dimensions.appWidth};
  z-index: 2;

  margin-left: ${breakpointValue(
    mediaQuery(dimensions.breakpointDesktop),
    dimensions.menuWidth,
    'unset'
  )};

  &::after {
    bottom: 0;
    content: '';
    left: 0;
    position: absolute;
    top: 0;
    touch-action: pan-x;
    width: ${({ swipeCaptureWidth }) => `${swipeCaptureWidth}px`};
  }
`;
