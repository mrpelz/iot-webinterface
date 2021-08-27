import { Diagnostics } from './diagnostics.js';
import { FunctionComponent } from 'preact';
import { StatusBar } from './status-bar.js';
import { styled } from 'goober';

const StyledApp = styled('main')`
  display: block;
  margin-top: var(--safe-area-inset-top);
  min-height: calc(100vh - var(--safe-area-inset-top));
  position: relative;
  width: 100vw;
`;

export const App: FunctionComponent = () => {
  return (
    <>
      <StatusBar />
      <StyledApp>
        <Diagnostics />
      </StyledApp>
    </>
  );
};
