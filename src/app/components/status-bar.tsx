import { styled } from 'goober';

import { colors, strings } from '../style.js';
import { dependentValue } from '../style/main.js';

export const StatusBar = styled('status-bar')<{
  isConnected: boolean;
  isLight: boolean;
}>`
  position: relative;
  display: block;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-name: ${dependentValue('isConnected', 'on-connect', 'none')};
  animation-timing-function: ease-out;
  background-color: ${dependentValue(
    'isConnected',
    'rgba(0, 255, 0, 0.4)',
    'rgba(255, 0, 0, 0.8)',
  )};
  block-size: ${strings.safeAreaInsetTop};

  @keyframes on-connect {
    from {
      background-color: rgb(0 255 0 / 40%);
    }

    to {
      background-color: transparent;
    }
  }

  &::before {
    position: absolute;
    z-index: -1;
    display: ${dependentValue('isLight', 'block', 'none')};
    background-color: ${colors.black()};
    content: '';
    inset-block: 0;
    inset-inline: 0;
  }
`;
