import { FlagsContext } from '../util/flags.js';
import { FunctionComponent } from 'preact';
import { Hierarchy } from './hierarchy.js';
import { WebApiContext } from '../web-api/hooks.js';
import { styled } from 'goober';
import { useContext } from 'preact/hooks';

const DiagnosticsContainer = styled('section')`
  background-color: rgba(255, 255, 255, 0.75);
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: scroll;
  position: fixed;
  width: 100vw;
`;

export const Diagnostics: FunctionComponent = () => {
  const { hierarchy } = useContext(WebApiContext);
  const { debug } = useContext(FlagsContext);

  return debug ? (
    <DiagnosticsContainer>
      <Hierarchy node={hierarchy} />
    </DiagnosticsContainer>
  ) : null;
};
