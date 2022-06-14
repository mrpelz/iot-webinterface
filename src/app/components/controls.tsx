import { colors, dimensions } from '../style.js';
import { half, multiply } from '../style/dimensions.js';
import { GridCell } from './grid.js';
import { bindComponent } from '../util/combine-components.js';
import { dependentValue } from '../style/main.js';
import { forwardRef } from 'preact/compat';
import { styled } from 'goober';

type CellProps = {
  isHighContrast: boolean;
  onClick?: () => void;
  span: number;
};

export const Cell = bindComponent<CellProps>(
  styled(GridCell)<CellProps>`
    --background-color: ${dependentValue(
      'isHighContrast',
      colors.backgroundSecondary(),
      colors.backgroundSecondary(70)
    )};
    --border-radius: 9px;
    --border: ${dependentValue(
      'isHighContrast',
      () => `solid ${dimensions.hairline()} ${colors.fontPrimary()()}`,
      'none'
    )};

    color: ${colors.fontPrimary()};
    font-size: ${dimensions.fontSizeSmall};
    overflow: hidden;
    cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  `,
  { isHighContrast: false, span: 2 }
);

export const Header = styled('cell-header')`
  align-items: center;
  background-color: ${colors.backgroundSecondary()};
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  border: var(--border);
  display: flex;
  gap: ${dimensions.controlBase};
  height: ${multiply(dimensions.controlBase, '4')};
  justify-content: space-between;
  overflow: hidden;
  padding: ${dimensions.controlBase};
`;

export const Body = styled('cell-body' as 'section', forwardRef)`
  align-content: flex-start;
  background-color: var(--background-color, none);
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
  border-bottom: var(--border);
  border-left: var(--border);
  border-right: var(--border);
  display: flex;
  flex-wrap: wrap;
  gap: ${dimensions.controlBase};
  padding: ${dimensions.controlBase};
`;

export const BodyLarge = styled(Body, forwardRef)`
  font-size: ${dimensions.fontSizeLarge};
  font-weight: bold;
  justify-content: center;
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
