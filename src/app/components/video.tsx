import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { colors } from '../style.js';
import { dependentValue } from '../style/main.js';

export const Poster = styled('img')`
  aspect-ratio: 16 / 9;
  margin-block-end: -4px;
  max-height: 640px;
  object-fit: contain;
  object-position: center;
  pointer-events: none;
  inline-size: 100%;
`;

export const Video = styled('video', forwardRef)`
  aspect-ratio: 16 / 9;
  background: ${colors.black(75)};
  cursor: ${dependentValue('onClick', 'pointer', 'default')};
  display: block;
  inline-size: 100%;
  max-height: 640px;
  object-fit: contain;
  object-position: center;
`;
