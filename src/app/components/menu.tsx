import { FunctionComponent } from 'preact';
import { appHeight } from './layout.js';
import { string } from '../style/main.js';
import { styled } from 'goober';

const _Menu = styled('nav')<{ testProp: boolean }>`
  min-height: ${appHeight()};
  --test: ${string('safeAreaInsetTop')};
`;

export const Menu: FunctionComponent = () => {
  return <_Menu testProp={false}>menu</_Menu>;
};
