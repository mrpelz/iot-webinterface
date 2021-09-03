import { FunctionComponent } from 'preact';
import { dependentValue } from '../style/main.js';
import { dimension } from '../style/dimensions.js';
import { hairline } from '../style.js';
import { styled } from 'goober';
import { useWebApi } from '../hooks/web-api.js';

const _Titlebar = styled('section')<{ isConnected: boolean }>`
  height: ${dimension('titlebarHeight')};

  border-top-style: solid;
  border-top-width: ${hairline()};
  border-top-color: ${dependentValue(
    'isConnected',
    'rgb(0, 255, 0)',
    'rgb(255, 0, 0)'
  )};
`;

export const Titlebar: FunctionComponent = ({ children }) => {
  const { streamOnline } = useWebApi();

  return <_Titlebar isConnected={streamOnline}>{children}</_Titlebar>;
};
