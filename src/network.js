import { flags, state } from './index.js';

export let hierarchy = null;
export let expand = null;

function expandTemplate(map) {
  const expression = '§(?:(\\d+)|\\{([^${}:]+)(?::([^§{}:]+))?\\})';

  return (string, ...subKeys) => {
    if (!string) return null;
    if (!string.includes('§')) {
      return map[string] || string;
    }

    const regex = new RegExp(expression, 'g');
    let match;
    let result = string;

    do {
      match = regex.exec(string);
      if (!match) break;

      const sub = match[0];
      const idx = match[1] && Number.parseInt(match[1], 10);
      const key = match[2];
      const def = match[3];

      result = result.replace(
        sub,
        (
          (idx && map[subKeys[idx]])
          || map[key]
          || def
          || ''
        )
      );
    } while (match);

    return result.length ? result : null;
  };
}

function fetchList() {
  const { api } = flags;
  const url = new URL('/list', api);

  return fetch(url.href, { credentials: 'same-origin', redirect: 'follow' }).then((response) => {
    return response.json();
  }).catch((reason) => {
    /* eslint-disable-next-line no-console */
    console.error(`error fetching "/list": ${reason}`);
    return null;
  });
}

function fetchValues() {
  const { api } = flags;
  const url = new URL('/values', api);

  return fetch(url.href, { credentials: 'same-origin', redirect: 'follow' }).then((response) => {
    return response.json();
  }).catch((reason) => {
    /* eslint-disable-next-line no-console */
    console.error(`error fetching "/values": ${reason}`);
    return null;
  });
}

function startStream(callback, onChange) {
  const { api } = flags;

  const handleData = ({ data }) => {
    try {
      const payload = JSON.parse(data);
      return callback(payload);
    } catch (e) {
      /* eslint-disable-next-line no-console */
      console.error(`error parsing message from  "/stream": ${e}`);
    }

    return null;
  };

  const onOpen = () => {
    onChange(true);
  };

  const onClose = () => {
    /* eslint-disable-next-line no-console */
    console.log('eventSource disconnected, reconnecting…');

    onChange(false);
  };

  const eventSource = new EventSource(new URL('/stream', api).href);
  eventSource.addEventListener('error', onClose);
  eventSource.addEventListener('message', handleData);
  eventSource.addEventListener('open', onOpen);
}

export function getSavedPage() {
  const savedPage = Number.parseInt(window.localStorage.getItem('page'), 10);
  state.set(
    '_selectedRoom',
    Number.isNaN(savedPage) ? 0 : savedPage
  );

  state.subscribe(
    '_selectedRoom',
    (index) => {
      window.localStorage.setItem('page', index.toString(10));
    }
  );
}

export function getDarkMode() {
  const dark = window.localStorage.getItem('dark') !== null;
  state.set('_darkMode', dark);

  state.subscribe(
    '_darkMode',
    (isDark) => {
      if (isDark) {
        document.documentElement.classList.add('dark');
        window.localStorage.setItem('dark', '1');
      } else {
        document.documentElement.classList.remove('dark');
        window.localStorage.removeItem('dark');
      }
    }
  );
}

export async function setUpElements() {
  const { hierarchy: fetchedHierarchy, strings = {} } = await fetchList() || {};

  hierarchy = fetchedHierarchy;
  expand = expandTemplate(strings);
}

export async function setUpValues() {
  const values = async () => {
    const apiResponse = await fetchValues() || [];

    apiResponse.forEach(({ name = null, value = null }) => {
      if (!name || value === null) return;

      state.set(name, value);
    });
  };

  return new Promise((resolve) => {
    const { stream } = flags;

    if (!stream) {
      resolve(values());
      return;
    }

    startStream((data) => {
      const { isSystem = false, name, value } = data;

      if (isSystem) {
        /* eslint-disable-next-line no-console */
        console.log(data);
      }

      if (!name) return;
      state.set(name, value);
    }, async (connected) => {
      if (connected) {
        await values();
      }
      state.set('_stream', connected);
      resolve();
    });
  });
}

export async function setElement(...sets) {
  const { api } = flags;
  const url = new URL('/set', api);

  sets.forEach(({ name, value }) => {
    url.searchParams.append(name, value);
  });

  if (
    ![...url.searchParams.keys()].length
  ) return Promise.resolve();

  return fetch(url.href, { credentials: 'same-origin', redirect: 'follow' }).catch((reason) => {
    /* eslint-disable-next-line no-console */
    console.error(`error fetching "/set": ${reason}`);
  });
}
