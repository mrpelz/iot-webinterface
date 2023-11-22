import { styled } from 'goober';

import { colors, strings } from '../style.js';
import { dependentValue } from '../style/main.js';

export const StatusBar = styled('status-bar')<{
  isConnected: boolean;
  isLight: boolean;
}>`
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-name: ${dependentValue('isConnected', 'onConnect', 'none')};
  animation-timing-function: ease-out;
  block-size: ${strings.safeAreaInsetTop};
  display: block;
  position: relative;

  background-color: ${dependentValue(
    'isConnected',
    'rgba(0, 255, 0, 0.4)',
    'rgba(255, 0, 0, 0.8)',
  )};

  @keyframes onConnect {
    from {
      background-color: rgba(0, 255, 0, 0.4);
    }

    to {
      background-color: transparent;
    }
  }

  &::before {
    background-color: ${colors.black()};
    content: '';
    display: ${dependentValue('isLight', 'block', 'none')};
    inset-block-end: 0;
    inset-block-start: 0;
    inset-inline-end: 0;
    inset-inline-start: 0;
    position: absolute;
    z-index: -1;
  }
`;
