import { effect } from '@preact/signals';

import { getSignal } from '../util/signal.js';
import { $rootPath } from './path.js';

effect(() => {
  getSignal($rootPath);

  requestAnimationFrame(() =>
    scrollTo({
      behavior: 'instant' as ScrollBehavior,
      top: 0,
    }),
  );
});
