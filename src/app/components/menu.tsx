import { FunctionComponent } from 'preact';
import { appHeight } from '../style.js';
import { styled } from 'goober';

const _Menu = styled('nav')<{ testProp: boolean }>`
  min-height: ${appHeight()};
`;

export const Menu: FunctionComponent = () => {
  return <_Menu testProp={false}>menu</_Menu>;
};
