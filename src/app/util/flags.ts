export type Flags = {
  apiBaseUrl: string | null;
  autoReloadCheckInterval: number | null;
  autoReloadUnattended: boolean;
  debug: boolean;
  enableNotifications: boolean;
  language: string | null;
  serviceWorker: boolean;
  startPage: string | null;
  theme: string | null;
};

const defaultFlags: Flags = {
  apiBaseUrl: null,
  autoReloadCheckInterval: null,
  autoReloadUnattended: false,
  debug: false,
  enableNotifications: true,
  language: null,
  serviceWorker: true,
  startPage: null,
  theme: null,
};

export let flags: Flags | null = null;

function getFlag<P extends keyof Flags>(
  hashFlags: URLSearchParams,
  queryFlags: URLSearchParams,
  flag: P,
  typeCast: (input: unknown) => Flags[P] | undefined
) {
  const storage =
    hashFlags.get(flag) ||
    queryFlags.get(flag) ||
    localStorage.getItem(`f_${flag}`);

  const value =
    storage === null
      ? undefined
      : (() => {
          const defaultValue = defaultFlags[flag];

          try {
            const readValue = typeCast(JSON.parse(storage));
            return readValue === undefined ? defaultValue : readValue;
          } catch {
            return defaultValue;
          }
        })();

  return value;
}

export function getFlags(): Flags {
  const hashFlags = new URLSearchParams(location.hash.slice(1));
  const queryFlags = new URLSearchParams(location.search);

  const readFlags: { [P in keyof Flags]: Flags[P] | undefined } = {
    apiBaseUrl: getFlag(hashFlags, queryFlags, 'apiBaseUrl', (input) => {
      return typeof input === 'string' ? input.trim() : undefined;
    }),
    autoReloadCheckInterval: getFlag(
      hashFlags,
      queryFlags,
      'autoReloadCheckInterval',
      (input) => Number.parseInt(String(input), 10)
    ),
    autoReloadUnattended: getFlag(
      hashFlags,
      queryFlags,
      'autoReloadUnattended',
      (input) => Boolean(input)
    ),
    debug: getFlag(hashFlags, queryFlags, 'debug', (input) => Boolean(input)),
    enableNotifications: getFlag(
      hashFlags,
      queryFlags,
      'enableNotifications',
      (input) => Boolean(input)
    ),
    language: getFlag(hashFlags, queryFlags, 'language', (input) => {
      return typeof input === 'string' ? input.trim() : undefined;
    }),
    serviceWorker: getFlag(hashFlags, queryFlags, 'serviceWorker', (input) =>
      Boolean(input)
    ),
    startPage: getFlag(hashFlags, queryFlags, 'startPage', (input) => {
      return typeof input === 'string' ? input.trim() : undefined;
    }),
    theme: getFlag(hashFlags, queryFlags, 'theme', (input) => {
      return typeof input === 'string' ? input.trim() : undefined;
    }),
  };

  const filteredFlags: Partial<Flags> = Object.fromEntries(
    Object.entries(readFlags).filter(([, value]) => value !== undefined)
  );

  flags = {
    ...defaultFlags,
    ...filteredFlags,
  };

  if (flags.debug) {
    // eslint-disable-next-line no-console
    console.table(
      Object.fromEntries(
        Object.entries(flags).map(([key, result]) => {
          const defaultFlag = defaultFlags[key as keyof Flags];
          const filteredFlag = filteredFlags[key as keyof Flags];

          return [
            key,
            /* eslint-disable sort-keys */
            {
              set: filteredFlag,
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

  return flags;
}

export function setFlag<P extends keyof Flags>(key: P, value: Flags[P]): Flags {
  if (value === defaultFlags[key]) {
    localStorage.removeItem(`f_${key}`);
  } else {
    localStorage.setItem(`f_${key}`, JSON.stringify(value));
  }

  flags = {
    ...(flags || defaultFlags),
    [key]: value,
  };

  return flags;
}
