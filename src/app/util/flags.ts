import { effect, Signal, signal } from '@preact/signals';
import { get, set } from 'idb-keyval';

import type { Flags } from '../../common/types.js';

const defaultFlags: Flags = {
  absoluteTimes: false,
  apiBaseUrl: null,
  debug: false,
  inactivityTimeout: null,
  language: null,
  path: null,
  screensaverEnable: false,
  screensaverRandomizePosition: false,
  startPage: null,
  theme: null,
  updateCheckInterval: null,
  updateUnattended: false,
};

const hashFlags = new URLSearchParams(location.hash.slice(1));
const queryFlags = new URLSearchParams(location.search);

export const $flags = Object.fromEntries(
  Object.entries(defaultFlags).map(([key, value]) => {
    const externalValue = (() => {
      const payload = hashFlags.get(key) ?? queryFlags.get(key);
      if (!payload) return undefined;

      try {
        return JSON.parse(payload);
      } catch {
        return undefined;
      }
    })();

    return [key, signal(externalValue ?? value)] as const;
  }),
) as { [K in keyof Flags]: Signal<Flags[K]> };

export type ObservableFlags = typeof $flags;

const isMeaningfulValue = (key: keyof Flags, input: unknown) => {
  if (input === undefined) return false;

  const defaultValue = defaultFlags[key];
  if (input === defaultValue) return false;

  return true;
};

for (const [key_, aSignal] of Object.entries($flags)) {
  const key = key_ as keyof Flags;

  (async () => {
    const oldValue = await get(key);
    if (!isMeaningfulValue(key, oldValue)) return;

    aSignal.value = oldValue;
  })();

  set(key, aSignal.value);
  effect(() => set(key, aSignal.value));
}

addEventListener('hashchange', ({ newURL }) => {
  for (const [key_, payload] of new URLSearchParams(
    new URL(newURL).hash.slice(1),
  ).entries()) {
    const key = key_ as keyof Flags;

    const value = (() => {
      try {
        return JSON.parse(payload);
      } catch {
        return undefined;
      }
    })();

    $flags[key].value = value;
  }
});
