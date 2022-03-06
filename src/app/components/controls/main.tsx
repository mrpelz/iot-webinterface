import { colors, dimensions } from '../../style.js';
import { GridCell } from '../grid.js';
import { bindComponent } from '../../util/combine-components.js';
import { styled } from 'goober';

export const Wrapper = bindComponent(
  styled(GridCell)<{ isHighContrast: boolean }>`
    background-color: ${colors.backgroundSecondary(75)};
    border-radius: ${dimensions.fontPadding};
    overflow: hidden;
    padding: ${dimensions.fontPadding};

    border: ${({ isHighContrast }) => {
      return isHighContrast
        ? `solid ${dimensions.hairline()} ${colors.fontPrimary()()}`
        : 'none';
    }};
  `,
  { span: 3 }
);
