import { entries } from 'idb-keyval';

import type { Flags } from '../common/types.js';

export const getFlags = async (): Promise<Flags> => {
  const flags = Object.fromEntries(await entries());

  return flags;
};
