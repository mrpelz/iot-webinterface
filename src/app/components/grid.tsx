import { styled } from 'goober';

import { dimensions } from '../style.js';

export const Grid = styled('grid')`
  display: grid;
  gap: ${dimensions.fontPadding};
  grid-template-columns: repeat(
    auto-fill,
    minmax(min(${dimensions.gridCellWidth}, 100%), 1fr)
  );
  margin: ${dimensions.fontPadding};
`;

export const GridCell = styled('grid-cell')<{ span?: number }>`
  display: block;
  grid-column-end: span ${({ span }) => `${span || 1}`};
`;
