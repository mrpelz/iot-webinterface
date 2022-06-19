import { BodyLarge } from './controls.js';
import { dimensions } from '../style.js';
import { styled } from 'goober';

export const RGBBody = styled(BodyLarge)`
  cursor: pointer;
`;

export const BodyDisableRoundedCorners = styled(RGBBody)`
  border-radius: 0;
`;

export const ColorLabel = styled('color-label')`
  align-self: end;
  flex-grow: 1;
  font-size: ${dimensions.fontSizeSmall};
  font-weight: normal;
`;
