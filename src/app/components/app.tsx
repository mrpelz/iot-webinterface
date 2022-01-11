import { dimensions, strings } from '../style.js';
import { styled } from 'goober';

export const App = styled('main')`
  color-scheme: ${strings.colorScheme};
  display: flow-root;
  font-family: ${strings.font};
  font-size: ${dimensions.fontSize};
`;
