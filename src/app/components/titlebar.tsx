import { Map, Menu } from './icons.js';
import { colors, dimensions } from '../style.js';
import { FunctionComponent } from 'preact';
import { styled } from 'goober';

const _Titlebar = styled('section')`
  background-color: ${colors.surface1()};
  display: grid;
  grid-auto-flow: row;
  grid-template-areas: '. . .';
  height: ${dimensions.titlebarHeight};
`;

const _Icon = styled('div')`
  height: ${dimensions.fontSize};
  padding: ${dimensions.fontPadding};
  position: relative;
  width: ${dimensions.titlebarHeight};
`;

const _Title = styled('div')`
  font-weight: bold;
  height: ${dimensions.fontSize};
  padding: ${dimensions.fontPadding};
`;

export const Titlebar: FunctionComponent = ({ children }) => {
  return (
    <_Titlebar>
      <_Icon>
        <Menu />
      </_Icon>
      <_Title>{children}</_Title>
      <_Icon>
        <Map />
      </_Icon>
    </_Titlebar>
  );
};
