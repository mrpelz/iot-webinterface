import { FunctionComponent } from 'preact';
import { styled } from 'goober';

const _Titlebar = styled('section')`
  height: var(--titlebar-height);
`;

export const Titlebar: FunctionComponent = ({ children }) => {
  return <_Titlebar>{children}</_Titlebar>;
};
