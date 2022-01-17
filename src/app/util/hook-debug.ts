import { getCountry } from './locale.js';
import { useEffect } from 'preact/hooks';
import { useFlag } from '../state/flags.js';

const country = getCountry() || undefined;

const memo: unknown[] = [];
let rerenderCount = 0;

export const useHookDebug = (label: string): void => {
  const debug = useFlag('debug');

  useEffect(() => {
    const now = new Date().toLocaleTimeString(country);
    const memoized = memo.pop();

    if (debug) {
      // eslint-disable-next-line no-console
      console.log(`${now}\t→${memoized || 'null'}\trender\t${label}`);
    }

    if (memoized && !memo.length) {
      rerenderCount += 1;

      if (debug) {
        // eslint-disable-next-line no-console
        console.log(`${now}\t${rerenderCount}\trerender done`);
      }
    }

    return () => {
      const salt = Math.floor(Math.random() * 100000).toString(16);

      if (debug) {
        // eslint-disable-next-line no-console
        console.log(
          `${new Date().toLocaleTimeString(
            country
          )}\t→${salt}\tunmount\t${label}`
        );
      }

      memo.push(salt);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label]);
};
