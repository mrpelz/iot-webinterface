import { styled } from 'goober';

import { colors, dimensions } from '../style.js';
import { dependentValue } from '../style/main.js';

export const Notification = styled('notification' as 'section')<{
  isVisible: boolean;
}>`
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: space-between;
  background-color: ${dependentValue(
    'isVisible',
    colors.selection(),
    'rgba(0, 0, 0, 0)',
  )};
  block-size: ${dependentValue('isVisible', dimensions.titlebarHeight, '0')};
  color: ${colors.backgroundPrimary()};
  cursor: ${dependentValue('onClick', 'pointer', 'default')};
  transition:
    background-color 0.3s ease-out,
    block-size 0.3s ease-out;
`;

export const DismissButton = styled('button')`
  margin: ${dimensions.fontPadding};
`;
