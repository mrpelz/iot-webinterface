import { useContext, useEffect, useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import { Hierarchy } from './hierarchy.js';
import { WebApiContext } from '../web-api/hooks.js';
import { styled } from 'goober';

const DIAGNOSTICS_KEY = 'd';
const DIAGNOSTICS_KEY_REPEAT = 5;
const DIAGNOSTICS_KEY_TIMEOUT = 5000;

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
  const [visible, setVisible] = useState(false);
  const [dCount, setDCount] = useState(0);
  const [dTimeout, setDTimeout] = useState<number | null>(null);

  const { hierarchy } = useContext(WebApiContext);

  useEffect(() => {
    const onDPress = ({ key }: KeyboardEvent) => {
      if (key !== DIAGNOSTICS_KEY) {
        setDCount(0);

        return;
      }

      setDCount(dCount + 1);
    };

    addEventListener('keyup', onDPress, { passive: true });

    return () => removeEventListener('keyup', onDPress);
  });

  useEffect(() => {
    if (dCount < DIAGNOSTICS_KEY_REPEAT) return;

    setVisible(!visible);
    setDCount(0);
  }, [dCount]);

  useEffect(() => {
    if (dTimeout) {
      clearTimeout(dTimeout);
    }

    setDTimeout(window.setTimeout(() => setDCount(0), DIAGNOSTICS_KEY_TIMEOUT));
  }, [dCount]);

  return visible ? (
    <DiagnosticsContainer>
      <Hierarchy node={hierarchy} />
    </DiagnosticsContainer>
  ) : null;
};
