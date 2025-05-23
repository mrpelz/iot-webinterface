import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { dimensions } from '../style.js';
import { BodyLarge } from './controls.js';

export const RGBBody = styled(BodyLarge, forwardRef)`
  cursor: pointer;
`;

export const BodyDisableRoundedCorners = styled(RGBBody, forwardRef)`
  border-radius: 0;
`;

export const ColorLabel = styled('color-label')`
  align-self: end;
  flex-grow: 1;
  font-size: ${dimensions.fontSizeSmall};
  font-weight: normal;
`;
