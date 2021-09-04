import { FunctionComponent } from 'preact';
import { dimensions } from '../style.js';
import { styled } from 'goober';

const _Menu = styled('nav')<{ testProp: boolean }>`
  min-height: ${dimensions.appHeight};
`;

export const Menu: FunctionComponent = () => {
  return <_Menu testProp={false}>menu</_Menu>;
};
