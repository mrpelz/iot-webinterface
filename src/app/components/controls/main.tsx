import { colors, dimensions } from '../../style.js';
import { GridCell } from '../grid.js';
import { bindComponent } from '../../util/combine-components.js';
import { dependentValue } from '../../style/main.js';
import { styled } from 'goober';

export const Wrapper = bindComponent(
  styled(GridCell)<{ isHighContrast: boolean }>`
    border-radius: ${dimensions.fontPadding};
    overflow: hidden;
    padding: ${dimensions.fontPadding};

    background-color: ${dependentValue(
      'isHighContrast',
      colors.backgroundSecondary(),
      colors.backgroundSecondary(80)
    )};
    border: ${dependentValue(
      'isHighContrast',
      () => `solid ${dimensions.hairline()} ${colors.fontPrimary()()}`,
      'none'
    )};
  `,
  { span: 3 }
);
