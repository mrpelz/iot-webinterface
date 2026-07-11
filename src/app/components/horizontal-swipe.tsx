import { styled } from 'goober';

import { dimensions } from '../style.js';

export const HorizontalSwipe = styled('horizontal-swipe')`
  position: absolute;
  display: flex;
  padding: ${dimensions.fontPadding};
  gap: ${dimensions.fontPadding};
  inline-size: 100%;
  overflow-x: auto;
`;
