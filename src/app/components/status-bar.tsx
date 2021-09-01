import { dependentValue, string } from '../style/main.js';
import { FunctionComponent } from 'preact';
import { styled } from 'goober';
import { useWebApi } from '../hooks/web-api.js';

const _StatusBar = styled('section')<{ isConnected: boolean }>`
  height: ${string('safeAreaInsetTop')};

  background-color: ${dependentValue(
    'isConnected',
    'rgba(0, 255, 0, 0.4)',
    'rgba(255, 0, 0, 0.8)'
  )};

  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
  animation-name: ${dependentValue('isConnected', 'onConnect', 'none')};

  @keyframes onConnect {
    from {
      background-color: rgba(0, 255, 0, 0.4);
    }

    to {
      background-color: rgba(0, 0, 0, 0);
    }
  }
`;

export const StatusBar: FunctionComponent = () => {
  const { streamOnline } = useWebApi();

  return <_StatusBar isConnected={streamOnline} />;
};
