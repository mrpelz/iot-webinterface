import { styled } from 'goober';

import { dimensions, strings } from '../style.js';
import { dependentValue } from '../style/main.js';

export const Screensaver = styled('screensaver' as 'section')<{
  isVisible: boolean;
}>`
  position: fixed;
  z-index: 4;
  overflow: hidden;
  background-color: black;
  color: rgb(128 128 128);
  font-size: ${dimensions.fontSizeLarge};
  font-variant-numeric: tabular-nums;
  inset: 0;
  opacity: ${dependentValue('isVisible', '1', '0')};
  pointer-events: ${dependentValue('isVisible', 'all', 'none')};
  touch-action: none;
  transition: opacity 0.3s ease-out;
`;

export const Time = styled('screensaver-time')<{ x: number; y: number }>`
  display: inline-block;
  text-align: center;
  transform: translate3d(
    calc((100vw - 100%) * ${({ x }) => x}),
    calc(
      ${strings.safeAreaInsetTop} +
        ((100vh - 100% - ${strings.safeAreaInsetTop}) * ${({ y }) => y})
    ),
    0
  );
  transition: transform 0.3s ease-out;
`;
