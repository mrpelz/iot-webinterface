import { effect } from '@preact/signals';

import { $rootPath } from './path.js';

effect(() => {
  // eslint-disable-next-line no-unused-expressions
  $rootPath.value;

  requestAnimationFrame(() =>
    scrollTo({
      behavior: 'instant' as ScrollBehavior,
      top: 0,
    }),
  );
});
