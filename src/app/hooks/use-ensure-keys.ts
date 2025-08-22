import { ensureKeys } from '@mrpelz/misc-utils/oop';
import { useMemo } from 'preact/hooks';

import { useArray } from './use-array-compare.js';

export const useEnsureKeys: typeof ensureKeys = (object, ...keys) => {
  const keys_ = useArray(keys);

  return useMemo(() => ensureKeys(object, ...keys_), [keys_, object]);
};
