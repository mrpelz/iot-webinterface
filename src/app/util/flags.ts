export type Flags = {
  absoluteTimes: boolean;
  apiBaseUrl: string | null;
  debug: boolean;
  inactivityTimeout: number | null;
  language: string | null;
  path: string | null;
  screensaverEnable: boolean;
  screensaverRandomizePosition: boolean;
  startPage: string | null;
  theme: string | null;
  updateCheckInterval: number | null;
};

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
};

export let flags: Flags | null = null;

const getFlag = <P extends keyof Flags>(
  hashFlags: URLSearchParams,
  queryFlags: URLSearchParams,
  flag: P,
  typeCast = (input: unknown) => input as Flags[P] | undefined,
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

  return { [flag]: value } as Record<P, Flags[P] | undefined>;
};

export const getFlags = (): Flags => {
  const hashFlags = new URLSearchParams(location.hash.slice(1));
  const queryFlags = new URLSearchParams(location.search);

  const readFlags: { [P in keyof Flags]: Flags[P] | undefined } = {
    ...getFlag(hashFlags, queryFlags, 'absoluteTimes', (input) =>
      Boolean(input),
    ),
    ...getFlag(hashFlags, queryFlags, 'apiBaseUrl', (input) =>
      typeof input === 'string' ? input.trim() : undefined,
    ),
    ...getFlag(hashFlags, queryFlags, 'debug', (input) => Boolean(input)),
    ...getFlag(hashFlags, queryFlags, 'inactivityTimeout', (input) =>
      typeof input === 'number' ? input : undefined,
    ),
    ...getFlag(hashFlags, queryFlags, 'language', (input) =>
      typeof input === 'string' ? input.trim() : undefined,
    ),
    ...getFlag(hashFlags, queryFlags, 'path', (input) =>
      typeof input === 'string' ? input.trim() : undefined,
    ),
    ...getFlag(hashFlags, queryFlags, 'screensaverEnable', (input) =>
      Boolean(input),
    ),
    ...getFlag(hashFlags, queryFlags, 'screensaverRandomizePosition', (input) =>
      Boolean(input),
    ),
    ...getFlag(hashFlags, queryFlags, 'startPage', (input) =>
      typeof input === 'string' ? input.trim() : undefined,
    ),
    ...getFlag(hashFlags, queryFlags, 'theme', (input) =>
      typeof input === 'string' ? input.trim() : undefined,
    ),
    ...getFlag(hashFlags, queryFlags, 'updateCheckInterval', (input) =>
      typeof input === 'number' ? input : undefined,
    ),
  };

  const filteredFlags: Partial<Flags> = Object.fromEntries(
    Object.entries(readFlags).filter(([, value]) => value !== undefined),
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
              // eslint-disable-next-line @typescript-eslint/naming-convention
              '↔️': result === defaultFlag ? '=' : '≠',
              default: defaultFlag,
              result,
            },
            /* eslint-enable sort-keys */
          ];
        }),
      ),
    );
  }

  return flags;
};

export const setFlag = <P extends keyof Flags>(
  key: P,
  value: Flags[P],
): Flags => {
  const url = new URL(location.href);

  const hashFlags = new URLSearchParams(url.hash.slice(1));
  const queryFlags = new URLSearchParams(url.search);

  if (value === defaultFlags[key]) {
    localStorage.removeItem(`f_${key}`);

    hashFlags.delete(key);
    queryFlags.delete(key);
  } else {
    const value_ = JSON.stringify(value);

    localStorage.setItem(`f_${key}`, value_);

    if (hashFlags.has(key)) hashFlags.set(key, value_);
    if (queryFlags.has(key)) queryFlags.set(key, value_);
  }

  flags = {
    ...(flags || defaultFlags),
    [key]: value,
  };

  url.hash = hashFlags.toString();
  url.search = queryFlags.toString();

  history.replaceState(undefined, '', url);

  return flags;
};
