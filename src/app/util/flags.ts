import { Theme, themes } from '../hooks/theme.js';
import { CHECK_INTERVAL } from './auto-reload.js';

export type Flags = {
  apiBaseUrl: string;
  autoReloadCheckInterval: number;
  autoReloadUnattended: boolean;
  debug: boolean;
  enableNotifications: boolean;
  language: string | null;
  pageOverride: string | null;
  serviceWorker: boolean;
  theme: Theme | null;
};

const defaultFlags: Flags = {
  apiBaseUrl: new URL('/', location.href).href,
  autoReloadCheckInterval: CHECK_INTERVAL,
  autoReloadUnattended: false,
  debug: false,
  enableNotifications: true,
  language: null,
  pageOverride: null,
  serviceWorker: true,
  theme: null,
};

function getFlag<T>(
  hashFlags: URLSearchParams,
  queryFlags: URLSearchParams,
  flag: string,
  typeCast: (input: string) => T | undefined
) {
  const storage =
    localStorage.getItem(`f_${flag}`) ||
    hashFlags.get(flag) ||
    queryFlags.get(flag);

  const value = storage === null ? undefined : typeCast(storage);

  return value;
}

export function getFlags(): Flags {
  const hashFlags = new URLSearchParams(location.hash.slice(1));
  const queryFlags = new URLSearchParams(location.search);

  const readFlags: { [P in keyof Flags]: Flags[P] | undefined } = {
    apiBaseUrl: getFlag(hashFlags, queryFlags, 'apiBaseUrl', (input) =>
      input.trim()
    ),
    autoReloadCheckInterval: getFlag(
      hashFlags,
      queryFlags,
      'autoReloadCheckInterval',
      (input) => Number.parseInt(input, 10)
    ),
    autoReloadUnattended: getFlag(
      hashFlags,
      queryFlags,
      'autoReloadUnattended',
      (input) => Boolean(Number.parseInt(input, 10))
    ),
    debug: getFlag(hashFlags, queryFlags, 'debug', (input) =>
      Boolean(Number.parseInt(input, 10))
    ),
    enableNotifications: getFlag(
      hashFlags,
      queryFlags,
      'enableNotifications',
      (input) => Boolean(Number.parseInt(input, 10))
    ),
    language: getFlag(hashFlags, queryFlags, 'language', (input) =>
      input.trim()
    ),
    pageOverride: getFlag(hashFlags, queryFlags, 'pageOverride', (input) =>
      input.trim()
    ),
    serviceWorker: getFlag(hashFlags, queryFlags, 'serviceWorker', (input) =>
      Boolean(Number.parseInt(input, 10))
    ),
    theme: getFlag(hashFlags, queryFlags, 'theme', (input) => {
      if (themes.includes(input as Theme)) return input as Theme;
      return undefined;
    }),
  };

  const setFlags: Partial<Flags> = Object.fromEntries(
    Object.entries(readFlags).filter(([, value]) => value !== undefined)
  );

  const combinedFlags: Flags = {
    ...defaultFlags,
    ...setFlags,
  };

  if (combinedFlags.debug) {
    // eslint-disable-next-line no-console
    console.table(
      Object.fromEntries(
        Object.entries(combinedFlags).map(([key, result]) => {
          const defaultFlag = defaultFlags[key as keyof Flags];
          const setFlag = setFlags[key as keyof Flags];

          return [
            key,
            /* eslint-disable sort-keys */
            {
              set: setFlag,
              '↔️': result === defaultFlag ? '=' : '≠',
              default: defaultFlag,
              result,
            },
            /* eslint-enable sort-keys */
          ];
        })
      )
    );
  }

  return combinedFlags;
}
