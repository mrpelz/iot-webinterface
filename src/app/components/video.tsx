import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { colors } from '../style.js';
import { dependentValue } from '../style/main.js';

export const Poster = styled('img')`
  max-height: 640px;
  aspect-ratio: 16 / 9;
  inline-size: 100%;
  margin-block-end: -4px;
  object-fit: contain;
  object-position: center;
  pointer-events: none;
`;

export const Video = styled('video', forwardRef)`
  display: block;
  max-height: 640px;
  aspect-ratio: 16 / 9;
  background: ${colors.black(75)};
  cursor: ${dependentValue('onClick', 'pointer', 'default')};
  inline-size: 100%;
  object-fit: contain;
  object-position: center;
`;
