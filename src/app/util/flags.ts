import { Theme, themes } from '../hooks/theme.js';
import { CHECK_INTERVAL } from './auto-reload.js';

export type Flags = {
  apiBaseUrl: string;
  autoReloadInterval: number;
  debug: boolean;
  diagnostics: boolean;
  enableNotifications: boolean;
  pageOverride: number | null;
  serviceWorker: boolean;
  theme: Theme | null;
};

const defaultFlags: Flags = {
  apiBaseUrl: new URL('/', location.href).href,
  autoReloadInterval: CHECK_INTERVAL,
  debug: false,
  diagnostics: false,
  enableNotifications: true,
  pageOverride: null,
  serviceWorker: true,
  theme: null,
};

function getFlag<T>(
  hashFlags: URLSearchParams,
  flag: string,
  typeCast: (input: string) => T | undefined
) {
  const storage = localStorage.getItem(`f_${flag}`) || hashFlags.get(flag);
  const value = storage === null ? undefined : typeCast(storage);

  return value;
}

export function getFlags(): Flags {
  const hashFlags = new URLSearchParams(location.hash.slice(1));

  const readFlags: { [P in keyof Flags]: Flags[P] | undefined } = {
    apiBaseUrl: getFlag(hashFlags, 'apiBaseUrl', String),
    autoReloadInterval: getFlag(hashFlags, 'autoReloadInterval', (input) =>
      Number.parseInt(input, 10)
    ),
    debug: getFlag(hashFlags, 'debug', (input) =>
      Boolean(Number.parseInt(input, 10))
    ),
    diagnostics: getFlag(hashFlags, 'diagnostics', (input) =>
      Boolean(Number.parseInt(input, 10))
    ),
    enableNotifications: getFlag(hashFlags, 'enableNotifications', (input) =>
      Boolean(Number.parseInt(input, 10))
    ),
    pageOverride: getFlag(hashFlags, 'pageOverride', (input) =>
      Number.parseInt(input, 10)
    ),
    serviceWorker: getFlag(hashFlags, 'serviceWorker', (input) =>
      Boolean(Number.parseInt(input, 10))
    ),
    theme: getFlag(hashFlags, 'theme', (input) => {
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
