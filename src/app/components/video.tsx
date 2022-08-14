import { colors, dimensions } from '../style.js';
import { dependentValue } from '../style/main.js';
import { forwardRef } from 'preact/compat';
import { styled } from 'goober';

export const Video = styled('video', forwardRef)`
  aspect-ratio: 16 / 9;
  background: ${colors.black(75)};
  cursor: ${dependentValue('onClick', 'pointer', 'default')};
  margin-block-end: -4px;
  max-height: 640px;
  object-fit: contain;
  object-position: center;
  width: ${dimensions.appWidth};
`;
