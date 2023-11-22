import { styled } from 'goober';

import { dependentValue } from '../style/main.js';

export const ShowHide = styled('show-hide')<{ show: boolean }>`
  display: ${dependentValue('show', 'contents', 'none')};
`;
