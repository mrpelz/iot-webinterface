import { colors, dimensions } from '../style.js';
import { dependentValue } from '../style/main.js';
import { styled } from 'goober';

export const SwipeBackWrapper = styled('swipe-back-wrapper')`
  block-size: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const SwipeBack = styled('swipe-back')<{ isHighContrast: boolean }>`
  background-color: ${dependentValue(
    'isHighContrast',
    colors.fontPrimary(),
    colors.fontPrimary(80)
  )};
  border-radius: 0 100% 100% 0;
  color: ${colors.backgroundSecondary()};
  display: flex;

  & > * {
    block-size: ${dimensions.fontSizeLarge};
    margin: ${dimensions.fontPadding};
  }
`;
