import { dependentValue } from '../../style/main.js';
import { styled } from 'goober';

export const OnlineOffline = styled('section')<{ isConnected: boolean }>`
  background-color: ${dependentValue(
    'isConnected',
    'rgba(0, 255, 0, 0.4)',
    'rgba(255, 0, 0, 0.8)'
  )};
`;
