import { dimensions, strings } from '../style.js';
import { styled } from 'goober';

export const App = styled('app')`
  color-scheme: ${strings.colorScheme};
  display: flow-root;
  font-family: ${strings.font};
  font-size: ${dimensions.fontSize};
`;
