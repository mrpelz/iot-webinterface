export type Flags = {
  apiBaseUrl: string | null;
  debug: boolean;
  enableNotifications: boolean;
  inactivityTimeout: number | null;
  language: string | null;
  serviceWorker: boolean;
  startPage: string | null;
  theme: string | null;
  updateCheckInterval: number | null;
  updateUnattended: boolean;
};

const defaultFlags: Flags = {
  apiBaseUrl: null,
  debug: false,
  enableNotifications: true,
  inactivityTimeout: null,
  language: null,
  serviceWorker: true,
  startPage: null,
  theme: null,
  updateCheckInterval: null,
  updateUnattended: false,
};

export let flags: Flags | null = null;

const getFlag = <P extends keyof Flags>(
  hashFlags: URLSearchParams,
  queryFlags: URLSearchParams,
  flag: P,
  typeCast = (input: unknown) => input as Flags[P] | undefined
) => {
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
};

export const getFlags = (): Flags => {
  const hashFlags = new URLSearchParams(location.hash.slice(1));
  const queryFlags = new URLSearchParams(location.search);

  const readFlags: { [P in keyof Flags]: Flags[P] | undefined } = {
    apiBaseUrl: getFlag(hashFlags, queryFlags, 'apiBaseUrl', (input) => {
      return typeof input === 'string' ? input.trim() : undefined;
    }),
    debug: getFlag(hashFlags, queryFlags, 'debug', (input) => Boolean(input)),
    enableNotifications: getFlag(
      hashFlags,
      queryFlags,
      'enableNotifications',
      (input) => Boolean(input)
    ),
    inactivityTimeout: getFlag(
      hashFlags,
      queryFlags,
      'inactivityTimeout',
      (input) => (typeof input === 'number' ? input : undefined)
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
    updateCheckInterval: getFlag(
      hashFlags,
      queryFlags,
      'updateCheckInterval',
      (input) => (typeof input === 'number' ? input : undefined)
    ),
    updateUnattended: getFlag(
      hashFlags,
      queryFlags,
      'updateUnattended',
      (input) => Boolean(input)
    ),
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
};

export const setFlag = <P extends keyof Flags>(
  key: P,
  value: Flags[P]
): Flags => {
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
};
