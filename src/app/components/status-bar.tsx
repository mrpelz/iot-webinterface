import { FunctionComponent } from 'preact';
import { WebApiContext } from '../web-api/hooks.js';
import { styled } from 'goober';
import { useContext } from 'preact/hooks';

const StyledStatusBar = styled('header')<{ isConnected: boolean }>`
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

  content: '';
  height: var(--safe-area-inset-top);
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 4;
`;

export const StatusBar: FunctionComponent = () => {
  const { streamOnline } = useContext(WebApiContext);

  return <StyledStatusBar isConnected={streamOnline} />;
};
