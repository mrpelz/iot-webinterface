import { styled } from 'goober';

import { dimensions } from '../style.js';

export const Grid = styled('grid')`
  display: grid;
  margin: ${dimensions.fontPadding};
  gap: ${dimensions.fontPadding};
  grid-template-columns: repeat(
    auto-fill,
    minmax(min(${dimensions.gridCellWidth}, 100%), 1fr)
  );
`;

export const GridCell = styled('grid-cell')<{ span?: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  grid-column-end: span ${({ span }) => `${span ?? 3}`};
`;
