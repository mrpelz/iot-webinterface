import { colors, dimensions } from '../style.js';
import { half, multiply } from '../style/dimensions.js';
import { GridCell } from './grid.js';
import { bindComponent } from '../util/combine-components.js';
import { dependentValue } from '../style/main.js';
import { styled } from 'goober';

type CellProps = {
  isHighContrast: boolean;
  onClick?: () => void;
  span: number;
};

export const Cell = bindComponent<CellProps>(
  styled(GridCell)<CellProps>`
    border-radius: 9px;
    color: ${colors.fontPrimary()};
    font-size: ${dimensions.fontSizeSmall};
    overflow: hidden;

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
    cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  `,
  { isHighContrast: false, span: 2 }
);

export const Header = styled('cell-header')`
  align-items: center;
  background-color: ${colors.backgroundSecondary()};
  display: flex;
  gap: ${dimensions.controlBase};
  height: ${multiply(dimensions.controlBase, '4')};
  justify-content: space-between;
  overflow: hidden;
  padding: ${dimensions.controlBase};
`;

export const Body = styled('cell-body')`
  align-content: flex-start;
  display: flex;
  flex-wrap: wrap;
  gap: ${dimensions.controlBase};
  padding: ${dimensions.controlBase};
`;

export const Title = styled('cell-title')`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Tag = styled('tag')`
  align-items: center;
  border-radius: ${half(dimensions.controlBase)};
  border: solid ${dimensions.hairline} ${colors.fontPrimary()};
  display: flex;
  flex-wrap: wrap;
  gap: ${dimensions.controlBase};
  min-height: ${multiply(dimensions.controlBase, '3')};
  overflow: hidden;
  padding-inline: ${dimensions.controlBase};

  & > * {
    flex-shrink: 0;
  }

  &:empty {
    visibility: hidden;
  }
`;

export const TagGroup = styled('tag-group')`
  align-items: center;
  border-inline-end: solid ${dimensions.hairline} ${colors.fontPrimary()};
  display: flex;
  gap: ${dimensions.controlBase};
  height: ${multiply(dimensions.controlBase, '3')};
  overflow: hidden;
  padding-inline-end: ${dimensions.controlBase};

  & > * {
    flex-shrink: 0;
  }

  &:empty {
    visibility: hidden;
  }

  &:last-child {
    border-inline-end: none;
    padding-inline-end: 0;
  }
`;
