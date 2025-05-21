import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { colors, dimensions } from '../style.js';
import { half, multiply } from '../style/dimensions.js';
import { dependentValue } from '../style/main.js';
import { GridCell } from './grid.js';

type CellProps = {
  isHighContrast: boolean;
  onClick?: () => void;
  span: number;
};

export const Cell = styled(GridCell)<CellProps>`
  --background-color: ${dependentValue(
    'isHighContrast',
    colors.backgroundSecondary(),
    colors.backgroundSecondary(70),
  )};
  --border-radius: 9px;
  --border: ${dependentValue(
    'isHighContrast',
    () => `solid ${dimensions.hairline()} ${colors.fontPrimary()()}`,
    'none',
  )};

  color: ${colors.fontPrimary()};
  font-size: ${dimensions.fontSizeSmall};
  overflow: hidden;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
`;

export const Header = styled('cell-header')`
  align-items: center;
  background-color: ${colors.backgroundSecondary()};
  block-size: ${multiply(dimensions.controlBase, '4')};
  border-start-end-radius: var(--border-radius);
  border-start-start-radius: var(--border-radius);
  border: var(--border);
  display: flex;
  gap: ${dimensions.controlBase};
  justify-content: space-between;
  overflow: hidden;
  padding: ${dimensions.controlBase};
`;

export const Body = styled('cell-body' as 'section', forwardRef)`
  align-content: flex-start;
  background-color: var(--background-color, none);
  border-block-end: var(--border);
  border-end-end-radius: var(--border-radius);
  border-end-start-radius: var(--border-radius);
  border-inline-end: var(--border);
  border-inline-start: var(--border);
  display: flex;
  flex-wrap: wrap;
  gap: ${dimensions.controlBase};
  padding: ${dimensions.controlBase};
`;

export const BodyLarge = styled(Body, forwardRef)`
  align-content: center;
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
  border: solid 1px ${colors.fontPrimary()};
  display: flex;
  flex-wrap: wrap;
  gap: ${dimensions.controlBase};
  min-inline-size: ${multiply(dimensions.controlBase, '3')};
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
  block-size: ${multiply(dimensions.controlBase, '3')};
  border-inline-end: solid ${dimensions.hairline} ${colors.fontPrimary()};
  display: flex;
  gap: ${dimensions.controlBase};
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
