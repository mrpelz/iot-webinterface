import { FunctionComponent } from 'preact';
import { useLayoutEffect } from 'preact/hooks';

import { useHookDebug } from '../hooks/use-hook-debug.js';
import { getSignal } from '../util/signal.js';
import { $rootPath } from './path.js';

export const ScrollEffects: FunctionComponent = () => {
  useHookDebug('Scroll');

  const segment0 = getSignal($rootPath);

  useLayoutEffect(() => {
    requestAnimationFrame(() =>
      scrollTo({
        behavior: 'instant' as ScrollBehavior,
        top: 0,
      }),
    );
  }, [segment0]);

  return null;
};
