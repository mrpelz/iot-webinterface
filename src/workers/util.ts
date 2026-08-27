import { isPlainObject } from '@mrpelz/misc-utils/oop';
import { createStore, entries } from 'idb-keyval';

import type { Flags } from '../common/types.js';

const NTFY_BASE_URL = 'https://ntfy.i.wurstsalat.cloud';

const store = createStore('flags', 'flags');

export const getFlags = async (): Promise<Flags> => {
  const flags = Object.fromEntries(await entries(store));

  return flags as Flags;
};

export const ntfyApiRequest = async (
  path: string,
  init?: RequestInit,
): Promise<object | undefined> => {
  const abortController = new AbortController();

  const timeout = setTimeout(() => abortController.abort(), 1000);
  const clear = () => clearTimeout(timeout);

  try {
    const response = await fetch(new URL(`/v1${path}`, NTFY_BASE_URL), {
      ...init,
      credentials: 'include',
      redirect: 'follow',
      signal: abortController.signal,
    }).catch(() => undefined);

    clear();

    if (!response || !response.ok) {
      return undefined;
    }

    const json = await response.json().catch();
    if (!json || !isPlainObject(json)) {
      return undefined;
    }

    return json;
  } catch {
    clear();

    return undefined;
  }
};
