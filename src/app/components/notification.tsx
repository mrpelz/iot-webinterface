import { colors, dimensions } from '../style.js';
import { dependentValue } from '../style/main.js';
import { styled } from 'goober';

export const Notification = styled('section')<{ isVisible: boolean }>`
  cursor: ${dependentValue('onClick', 'pointer', 'default')};
  height: ${dependentValue('isVisible', dimensions.titlebarHeight, '0')};
  overflow: hidden;
  transition: background-color 0.3s ease-out, height 0.3s ease-out;

  background-color: ${dependentValue(
    'isVisible',
    colors.selection(),
    'rgba(0, 0, 0, 0)'
  )};
`;
