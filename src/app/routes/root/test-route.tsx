import { styled } from 'goober';
import { FunctionComponent } from 'preact';

import { JSONViewer } from '../../components/json-viewer/main.js';
import { useGoRoot, useSegment } from '../../state/path.js';
import { useSetTitleOverride } from '../../state/title.js';

const Margin = styled('section')`
  margin: 2rem;
`;

export const Test: FunctionComponent = () => {
  const goRoot = useGoRoot();

  const [route1, setRoute1] = useSegment(1);
  const [route2, setRoute2] = useSegment(2);

  useSetTitleOverride(route2 || route1 || undefined);

  return (
    <>
      <button
        disabled={!setRoute1}
        onClick={() =>
          setRoute1?.(Math.round(Math.random() * 10 ** 16).toString(16))
        }
      >
        {route1 || '<none>'}
      </button>
      <br />
      <button disabled={!route1} onClick={() => setRoute1?.(undefined)}>
        reset
      </button>
      <br />
      <br />
      <button
        disabled={!setRoute2}
        onClick={() =>
          setRoute2?.(Math.round(Math.random() * 10 ** 16).toString(16))
        }
      >
        {route2 || '<none>'}
      </button>
      <br />
      <button disabled={!route2} onClick={() => setRoute2?.(undefined)}>
        reset
      </button>
      <br />
      <br />
      <button disabled={!goRoot} onClick={() => goRoot?.()}>
        go root
      </button>

      <Margin>
        <JSONViewer
          rootLabel="Test"
          value={{
            a: {
              b: {
                c: {
                  d: {
                    e: [
                      { f: 'fuck I' },
                      { f: 'fuck II' },
                      { f: 'fuck III' },
                      { f: 'fuck IV' },
                    ],
                  },
                },
              },
            },
          }}
        />
      </Margin>
    </>
  );
};
