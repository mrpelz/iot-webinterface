import { FunctionComponent } from 'preact';
import { styled } from 'goober';
import { useWebApi } from '../hooks/web-api.js';

const _StatusBar = styled('section')<{ isConnected: boolean }>`
  background-color: ${({ isConnected }) => {
    if (isConnected) {
      return 'rgba(0, 255, 0, 0.4);';
    }

    return 'rgba(255, 0, 0, 0.8);';
  }};

  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
  animation-name: ${({ isConnected }) => {
    if (!isConnected) {
      return undefined;
    }

    return 'onConnect';
  }};

  @keyframes onConnect {
    from {
      background-color: rgba(0, 255, 0, 0.4);
    }

    to {
      background-color: rgba(0, 0, 0, 0);
    }
  }

  height: var(--safe-area-inset-top);
`;

export const StatusBar: FunctionComponent = () => {
  const { streamOnline } = useWebApi();

  return <_StatusBar isConnected={streamOnline} />;
};
