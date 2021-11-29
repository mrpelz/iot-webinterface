import { colors, strings } from '../style.js';
import { FunctionComponent } from 'preact';
import { dependentValue } from '../style/main.js';
import { styled } from 'goober';
import { useTheme } from '../hooks/theme.js';
import { useWebApi } from '../hooks/web-api.js';

const _StatusBar = styled('section')<{
  isConnected: boolean;
  isLight: boolean;
}>`
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-name: ${dependentValue('isConnected', 'onConnect', 'none')};
  animation-timing-function: ease-out;
  height: ${strings.safeAreaInsetTop};
  position: relative;

  background-color: ${dependentValue(
    'isConnected',
    'rgba(0, 255, 0, 0.4)',
    'rgba(255, 0, 0, 0.8)'
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
    bottom: 0;
    content: '';
    display: ${dependentValue('isLight', 'block', 'none')};
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: -1;
  }
`;

export const StatusBar: FunctionComponent = () => {
  const { streamOnline } = useWebApi();
  const theme = useTheme();

  return <_StatusBar isConnected={streamOnline} isLight={theme === 'light'} />;
};
