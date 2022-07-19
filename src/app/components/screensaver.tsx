import { dimensions, strings } from '../style.js';
import { dependentValue } from '../style/main.js';
import { styled } from 'goober';

export const Screensaver = styled('screensaver' as 'div')<{
  isVisible: boolean;
}>`
  background-color: black;
  color: rgb(128, 128, 128);
  font-size: ${dimensions.fontSizeLarge};
  font-variant-numeric: tabular-nums;
  inset: 0;
  overflow: hidden;
  position: fixed;
  touch-action: none;
  transition: opacity 0.3s ease-out;
  z-index: 4;

  opacity: ${dependentValue('isVisible', '1', '0')};
  pointer-events: ${dependentValue('isVisible', 'all', 'none')};
`;

export const Time = styled('screensaver-time')<{ x: number; y: number }>`
  display: inline-block;
  text-align: center;
  transition: transform 0.3s ease-out;

  transform: translate3d(
    calc((100vw - 100%) * ${({ x }) => x}),
    calc(
      ${strings.safeAreaInsetTop} +
        ((100vh - 100% - ${strings.safeAreaInsetTop}) * ${({ y }) => y})
    ),
    0
  );
`;
