import { useEffect } from 'preact/hooks';

import { flags } from '../util/flags.js';
import { getCountry } from '../util/locale.js';

const country = getCountry() || undefined;

const memo: unknown[] = [];
let rerenderCount = 0;

export const useHookDebug = (label: string, force = false): void => {
  const { value: debug } = flags.debug;

  if (debug || force) {
    // eslint-disable-next-line no-console
    console.log(
      `${new Date().toLocaleTimeString(country)}\t→\trender\t${label}`,
    );
  }

  useEffect(() => {
    const now = new Date().toLocaleTimeString(country);
    const memoized = memo.pop();

    if (debug || force) {
      // eslint-disable-next-line no-console
      console.log(`${now}\t→${memoized || 'null'}\tmount\t${label}`);
    }

    if (memoized && memo.length === 0) {
      rerenderCount += 1;

      if (debug || force) {
        // eslint-disable-next-line no-console
        console.log(`${now}\t${rerenderCount}\tmount done`);
      }
    }

    return () => {
      const salt = Math.floor(Math.random() * 100_000).toString(16);

      if (debug || force) {
        // eslint-disable-next-line no-console
        console.log(
          `${new Date().toLocaleTimeString(
            country,
          )}\t→${salt}\tunmount\t${label}`,
        );
      }

      memo.push(salt);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label]);
};
