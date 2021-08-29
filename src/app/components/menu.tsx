import { FunctionComponent } from 'preact';
import { styled } from 'goober';

const _Menu = styled('nav')`
  min-height: var(--app-height);
`;

export const Menu: FunctionComponent = () => {
  return <_Menu>menu</_Menu>;
};
