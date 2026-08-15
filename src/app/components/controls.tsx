import { styled } from 'goober';
import { MouseEventHandler } from 'preact';
import { forwardRef } from 'preact/compat';

import { colors, dimensions } from '../style.js';
import { half, multiply } from '../style/dimensions.js';
import { dependentValue } from '../style/main.js';
import { GridCell } from './grid.js';

type CellProps = {
  isHighContrast: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
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

  overflow: hidden;
  color: ${colors.fontPrimary()};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  font-size: ${dimensions.fontSizeSmall};
`;

export const Header = styled('cell-header')<{
  borderRadius?: boolean;
}>`
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: space-between;
  padding: ${dimensions.controlBase};
  border: var(--border);
  background-color: ${colors.backgroundSecondary()};
  block-size: ${multiply(dimensions.controlBase, '4')};
  border-start-end-radius: ${({ borderRadius = true }) =>
    borderRadius ? 'var(--border-radius)' : 'none'};
  border-start-start-radius: ${({ borderRadius = true }) =>
    borderRadius ? 'var(--border-radius)' : 'none'};
  gap: ${dimensions.controlBase};
`;

export const Body = styled('cell-body' as 'section', forwardRef)<{
  borderRadius?: boolean;
}>`
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  padding: ${dimensions.controlBase};
  background-color: var(--background-color, none);
  border-block-end: var(--border);
  border-end-end-radius: ${({ borderRadius = true }) =>
    borderRadius ? 'var(--border-radius)' : 'none'};
  border-end-start-radius: ${({ borderRadius = true }) =>
    borderRadius ? 'var(--border-radius)' : 'none'};
  border-inline-end: var(--border);
  border-inline-start: var(--border);
  gap: ${dimensions.controlBase};
`;

export const BodyLarge = styled(Body, forwardRef)`
  font-size: ${dimensions.fontSizeLarge};
  font-weight: bold;
  place-content: center center;
`;

export const BodyBottomBand = styled(Body, forwardRef)`
  block-size: ${dimensions.fontSize};
  border-block-start: solid ${dimensions.hairline} ${colors.fontPrimary()};
  font-size: ${dimensions.fontSizeSmall};
  padding-block: 0;
  place-content: flex-end center;
`;

export const Title = styled('cell-title')`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export type TagProps = {
  backgroundColor?: string;
  grow?: boolean;
  invert?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
};

export const Tag = styled('tag')<TagProps>`
  display: flex;
  overflow: hidden;
  width: ${({ grow }) => (grow ? '100%' : '')};
  flex-wrap: wrap;
  align-items: center;
  border: solid 1px currentcolor;
  border-radius: ${half(dimensions.controlBase)};
  background-color: ${({ backgroundColor, invert }) =>
    backgroundColor ?? (invert ? colors.fontPrimary()() : 'transparent')};
  color: ${({ invert }) =>
    invert ? colors.backgroundPrimary()() : colors.fontPrimary()()};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  gap: ${dimensions.controlBase};
  min-inline-size: ${multiply(dimensions.controlBase, '3')};
  padding-inline: ${dimensions.controlBase};

  & > * {
    flex-shrink: 0;
  }

  &:empty {
    visibility: hidden;
  }
`;

export const TagGroup = styled('tag-group')`
  display: flex;
  overflow: hidden;
  flex-grow: 1;
  align-items: center;
  block-size: ${multiply(dimensions.controlBase, '3')};
  border-inline-end: solid ${dimensions.hairline} ${colors.fontPrimary()};
  gap: ${dimensions.controlBase};
  padding-inline-end: ${dimensions.controlBase};

  & > * {
    flex-shrink: 0;
  }

  &:empty {
    visibility: hidden;
  }

  &:last-child {
    flex-grow: 0;
    border-inline-end: none;
    padding-inline-end: 0;
  }
`;
