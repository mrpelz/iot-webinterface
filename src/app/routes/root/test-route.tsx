import { FunctionComponent } from 'preact';

import { $isRoot, getSegment, goRoot, setSegment } from '../../state/path.js';
import { useSetTitleOverride } from '../../state/title.js';
import { getSignal } from '../../util/signal.js';

const $route1 = getSegment(1);
const $setRoute1 = setSegment(1);

const $route2 = getSegment(2);
const $setRoute2 = setSegment(2);

export const Test: FunctionComponent = () => {
  const isRoot = getSignal($isRoot);
  const route1 = getSignal($route1);
  const setRoute1 = getSignal($setRoute1);

  const route2 = getSignal($route2);
  const setRoute2 = getSignal($setRoute2);

  useSetTitleOverride(route2 || route1 || null);

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
      <button disabled={!route1} onClick={() => setRoute1(null)}>
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
      <button disabled={!route2} onClick={() => setRoute2(null)}>
        reset
      </button>
      <br />
      <br />
      <button disabled={isRoot} onClick={() => goRoot()}>
        go root
      </button>
    </>
  );
};
