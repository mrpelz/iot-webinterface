import { colors, dimensions } from '../style.js';
import { dependentValue } from '../style/main.js';
import { styled } from 'goober';

export const SwipeBackWrapper = styled('div')`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
`;

export const SwipeBack = styled('div')<{ isHighContrast: boolean }>`
  background-color: ${dependentValue(
    'isHighContrast',
    colors.fontPrimary(),
    colors.fontPrimary(80)
  )};
  border-radius: 0 100% 100% 0;
  color: ${colors.backgroundSecondary()};
  display: flex;

  & > * {
    height: ${dimensions.fontSizeLarge};
    margin: ${dimensions.fontPadding};
  }
`;
