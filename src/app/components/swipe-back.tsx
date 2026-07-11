import { styled } from 'goober';

import { colors, dimensions } from '../style.js';
import { dependentValue } from '../style/main.js';

export const SwipeBackWrapper = styled('swipe-back-wrapper')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  block-size: 100%;
`;

export const SwipeBack = styled('swipe-back')<{ isHighContrast: boolean }>`
  display: flex;
  border-radius: 0 100% 100% 0;
  background-color: ${dependentValue(
    'isHighContrast',
    colors.fontPrimary(),
    colors.fontPrimary(80),
  )};
  color: ${colors.backgroundSecondary()};

  & > * {
    margin: ${dimensions.fontPadding};
    block-size: ${dimensions.fontSizeLarge};
  }
`;
