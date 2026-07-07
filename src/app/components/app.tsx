import { styled } from 'goober';

import { strings } from '../style.js';

export const App = styled('app' as 'main')`
  color-scheme: ${strings.colorScheme};
  display: flow-root;
  isolation: isolate;
`;
