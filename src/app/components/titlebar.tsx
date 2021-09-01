import { FunctionComponent } from 'preact';
import { dimension } from '../style/dimensions.js';
import { styled } from 'goober';

const _Titlebar = styled('section')`
  height: ${dimension('titlebarHeight')};
`;

export const Titlebar: FunctionComponent = ({ children }) => {
  return <_Titlebar>{children}</_Titlebar>;
};
