import { colors, dimensions } from '../style.js';
import { dependentValue } from '../style/main.js';
import { styled } from 'goober';

export const Notification = styled('notification' as 'section')<{
  isVisible: boolean;
}>`
  align-items: center;
  color: ${colors.backgroundPrimary()};
  cursor: ${dependentValue('onClick', 'pointer', 'default')};
  display: flex;
  height: ${dependentValue('isVisible', dimensions.titlebarHeight, '0')};
  justify-content: space-between;
  overflow: hidden;
  transition: background-color 0.3s ease-out, height 0.3s ease-out;

  background-color: ${dependentValue(
    'isVisible',
    colors.selection(),
    'rgba(0, 0, 0, 0)'
  )};
`;

export const DismissButton = styled('button')`
  margin: ${dimensions.fontPadding};
`;
