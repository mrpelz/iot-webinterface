import { styled } from 'goober';

import { colors, dimensions } from '../style.js';

export const Hidden = styled('hidden' as 'section')`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  padding: ${dimensions.fontPadding};
  color: ${colors.fontPrimary(undefined, 'light')};
  inline-size: 100%;
  inset-block-end: 100%;
`;
