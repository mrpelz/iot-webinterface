import { CHECK_INTERVAL } from './auto-reload.js';

export type Flags = {
  apiBaseUrl: string;
  autoReloadInterval: number;
  darkOverride: boolean;
  debug: boolean;
  dimOverride: boolean;
  enableNotifications: boolean;
  invisibleOnBlur: boolean;
  lightOverride: boolean;
  lowPriorityStream: boolean;
  oledOptimizations: boolean;
  pageOverride: number | null;
  serviceWorker: boolean;
};

const defaultFlags: Flags = {
  apiBaseUrl: new URL('/', location.href).href,
  autoReloadInterval: CHECK_INTERVAL,
  darkOverride: false,
  debug: false,
  dimOverride: false,
  enableNotifications: true,
  invisibleOnBlur: false,
  lightOverride: false,
  lowPriorityStream: false,
  oledOptimizations: false,
  pageOverride: null,
  serviceWorker: true,
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

  const readFlags: Partial<Flags> = {
    apiBaseUrl: getFlag(hashFlags, 'apiBaseUrl', String),
    autoReloadInterval: getFlag(hashFlags, 'autoReloadInterval', (input) =>
      Number.parseInt(input, 10)
    ),
    darkOverride: getFlag(hashFlags, 'darkOverride', (input) =>
      Boolean(Number.parseInt(input, 10))
    ),
    debug: getFlag(hashFlags, 'debug', (input) =>
      Boolean(Number.parseInt(input, 10))
    ),
    dimOverride: getFlag(hashFlags, 'dimOverride', (input) =>
      Boolean(Number.parseInt(input, 10))
    ),
    enableNotifications: getFlag(hashFlags, 'enableNotifications', (input) =>
      Boolean(Number.parseInt(input, 10))
    ),
    invisibleOnBlur: getFlag(hashFlags, 'invisibleOnBlur', (input) =>
      Boolean(Number.parseInt(input, 10))
    ),
    lightOverride: getFlag(hashFlags, 'lightOverride', (input) =>
      Boolean(Number.parseInt(input, 10))
    ),
    lowPriorityStream: getFlag(hashFlags, 'lowPriorityStream', (input) =>
      Boolean(Number.parseInt(input, 10))
    ),
    oledOptimizations: getFlag(hashFlags, 'oledOptimizations', (input) =>
      Boolean(Number.parseInt(input, 10))
    ),
    pageOverride: getFlag(hashFlags, 'pageOverride', (input) =>
      Number.parseInt(input, 10)
    ),
    serviceWorker: getFlag(hashFlags, 'serviceWorker', (input) =>
      Boolean(Number.parseInt(input, 10))
    ),
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
