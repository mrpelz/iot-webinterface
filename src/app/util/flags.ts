import { CHECK_INTERVAL } from './auto-reload.js';

export type Flags = {
  apiBaseUrl: string;
  autoReload: number;
  darkOverride: boolean | null;
  debug: boolean;
  invisibleOnBlur: boolean;
  lowPriorityStream: boolean;
  notifications: boolean;
  oledOptimizations: boolean;
  pageOverride: number | null;
  serviceWorker: boolean;
  stream: boolean;
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
  const defaults: Flags = {
    apiBaseUrl: new URL('/', location.href).href,
    autoReload: CHECK_INTERVAL,
    darkOverride: null,
    debug: false,
    invisibleOnBlur: false,
    lowPriorityStream: false,
    notifications: true,
    oledOptimizations: false,
    pageOverride: null,
    serviceWorker: true,
    stream: true,
  };

  let flags = {} as Flags;

  const fn = () => {
    const hashFlags = new URLSearchParams(location.hash.slice(1));

    const setFlags: Partial<Flags> = Object.fromEntries(
      Object.entries({
        apiBaseUrl: getFlag(hashFlags, 'apiBaseUrl', String),
        autoReload: getFlag(hashFlags, 'autoReload', (input) =>
          Number.parseInt(input, 10)
        ),
        darkOverride: getFlag(hashFlags, 'darkOverride', (input) =>
          Boolean(Number.parseInt(input, 10))
        ),
        debug: getFlag(hashFlags, 'debug', (input) =>
          Boolean(Number.parseInt(input, 10))
        ),
        invisibleOnBlur: getFlag(hashFlags, 'invisibleOnBlur', (input) =>
          Boolean(Number.parseInt(input, 10))
        ),
        lowPriorityStream: getFlag(hashFlags, 'lowPriorityStream', (input) =>
          Boolean(Number.parseInt(input, 10))
        ),
        notifications: getFlag(hashFlags, 'notifications', (input) =>
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
        stream: getFlag(hashFlags, 'stream', (input) =>
          Boolean(Number.parseInt(input, 10))
        ),
      }).filter(([, value]) => value !== undefined)
    );

    flags = {
      ...defaults,
      ...setFlags,
    };

    // eslint-disable-next-line no-console
    console.table(
      Object.fromEntries(
        Object.entries(flags).map(([key, result]) => {
          const defaultFlag = defaults[key as keyof Flags];
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
  };

  fn();
  onhashchange = fn;

  return flags;
}
