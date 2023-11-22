import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { BodyLarge } from './controls.js';

export const TriggerBody = styled(BodyLarge, forwardRef)`
  opacity: 0;
`;
