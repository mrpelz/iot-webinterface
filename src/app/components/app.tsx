import { styled } from 'goober';

import { strings } from '../style.js';

export const App = styled('app' as 'main')`
  display: flow-root;
  color-scheme: ${strings.colorScheme};
  isolation: isolate;
`;
