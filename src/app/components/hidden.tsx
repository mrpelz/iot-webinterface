import { styled } from 'goober';

import { colors, dimensions } from '../style.js';

export const Hidden = styled('hidden' as 'section')`
  align-items: center;
  color: ${colors.fontPrimary(undefined, 'light')};
  display: flex;
  flex-direction: column;
  inline-size: 100%;
  inset-block-end: 100%;
  justify-content: end;
  padding: ${dimensions.fontPadding};
  position: absolute;
`;
