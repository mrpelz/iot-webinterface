import { createStore, entries } from 'idb-keyval';

import type { Flags } from '../common/types.js';

const store = createStore('flags', 'flags');

export const getFlags = async (): Promise<Flags> => {
  const flags = Object.fromEntries(await entries(store));

  return flags;
};
