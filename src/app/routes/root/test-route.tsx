import { styled } from 'goober';
import { FunctionComponent } from 'preact';

import { JSONViewer } from '../../components/json-viewer/main.js';
import { $isRoot, getSegment, goRoot, setSegment } from '../../state/path.js';
import { useTitleOverride } from '../../state/title.js';

const $route1 = getSegment(1);
const setRoute1 = setSegment(1);

const $route2 = getSegment(2);
const setRoute2 = setSegment(2);

const Margin = styled('section')`
  margin: 2rem;
`;

export const Test: FunctionComponent = () => {
  const isRoot = $isRoot.value;
  const route1 = $route1.value;

  const route2 = $route2.value;

  useTitleOverride(route2 || route1 || undefined);

  return (
    <>
      <button
        onClick={() =>
          setRoute1(Math.round(Math.random() * 10 ** 16).toString(16))
        }
      >
        {route1 || '<none>'}
      </button>
      <br />
      <button disabled={!route1} onClick={() => setRoute1(undefined)}>
        reset
      </button>
      <br />
      <br />
      <button
        onClick={() =>
          setRoute2(Math.round(Math.random() * 10 ** 16).toString(16))
        }
      >
        {route2 || '<none>'}
      </button>
      <br />
      <button disabled={!route2} onClick={() => setRoute2(undefined)}>
        reset
      </button>
      <br />
      <br />
      <button disabled={isRoot} onClick={() => goRoot()}>
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
