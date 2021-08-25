import { FunctionComponent } from 'preact';
import { styled } from 'goober';

const StyledApp = styled('main')`
  display: block;
  margin-top: var(--safe-area-inset-top);
  min-height: calc(100vh - var(--safe-area-inset-top));
  width: 100vw;
`;

export const App: FunctionComponent = () => {
  return <StyledApp />;
};
