import { FunctionComponent } from 'preact';
import { dimensions } from '../style.js';
import { styled } from 'goober';
import { useWebApi } from '../hooks/web-api.js';

const _Titlebar = styled('section')<{ isConnected: boolean }>`
  height: ${dimensions.titlebarHeight};
`;

export const Titlebar: FunctionComponent = ({ children }) => {
  const { streamOnline } = useWebApi();

  return <_Titlebar isConnected={streamOnline}>{children}</_Titlebar>;
};
