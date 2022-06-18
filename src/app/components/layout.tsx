import { colors, dimensions } from '../style.js';
import { dependentValue, mediaQuery } from '../style/main.js';
import { breakpointValue } from '../style/breakpoint.js';
import { forwardRef } from 'preact/compat';
import { styled } from 'goober';

export const Header = styled('header')`
  background-color: ${colors.backgroundSecondary()};
  inline-size: 100%;
  inset-block-start: 0;
  inset-inline-start: 0;
  position: fixed;
  touch-action: none;
  z-index: 4;
`;

export const Aside = styled('aside', forwardRef)<{
  isVisible: boolean;
}>`
  block-size: ${dimensions.appHeight};
  inset-block-start: ${dimensions.headerHeightAdaptive};
  inset-inline-start: 0;
  position: fixed;
  transition: block-size 0.3s ease-out, transform 0.3s ease-out,
    inset-block-start 0.3s ease-out;
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
  inline-size: ${dimensions.appWidth};
  margin-block-start: ${dimensions.headerHeightAdaptive};
  min-block-size: ${dimensions.appHeightAdaptive};
  position: relative;
  touch-action: ${dependentValue('isAsideVisible', 'none', 'auto')};
  transition: block-size 0.3s ease-out, margin-block-start 0.3s ease-out;
  z-index: 2;

  margin-inline-start: ${breakpointValue(
    mediaQuery(dimensions.breakpointDesktop),
    dimensions.menuWidth,
    'unset'
  )};

  &::after {
    content: '';
    inset-block-end: 0;
    inset-block-start: 0;
    inset-inline-start: 0;
    position: absolute;
    touch-action: pan-x;

    inline-size: ${({ swipeCaptureWidth }) =>
      breakpointValue(
        mediaQuery(dimensions.breakpointDesktop),
        '0',
        `${swipeCaptureWidth}px`
      )()};
  }
`;
