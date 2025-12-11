import { styled } from 'goober';

import { dimensions } from '../style.js';

export const HorizontalSwipe = styled('horizontal-swipe')`
  display: flex;
  gap: ${dimensions.fontPadding};
  inline-size: 100%;
  overflow-x: auto;
  padding: ${dimensions.fontPadding};
  position: absolute;
`;
