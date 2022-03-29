import { dependentValue } from '../style/main.js';
import { styled } from 'goober';

export const ShowHide = styled('show-hide')<{ show: boolean }>`
  display: ${dependentValue('show', 'contents', 'none')};
`;
