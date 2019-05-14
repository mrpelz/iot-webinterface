const apiBaseUrl = window.location.href;

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
  const url = new URL('/list', apiBaseUrl);

  return fetch(url, { credentials: 'include', redirect: 'follow' }).then((response) => {
    return response.json();
  }).catch((reason) => {
    /* eslint-disable-next-line no-console */
    console.error(`error fetching "/list": ${reason}`);
    return null;
  });
}

function fetchValues() {
  const url = new URL('/values', apiBaseUrl);

  return fetch(url, { credentials: 'include', redirect: 'follow' }).then((response) => {
    return response.json();
  }).catch((reason) => {
    /* eslint-disable-next-line no-console */
    console.error(`error fetching "/values": ${reason}`);
    return null;
  });
}

function startStream(callback, onChange) {
  let eventSource = null;

  const handleData = ({ data }) => {
    try {
      const payload = JSON.parse(data);
      callback(payload);
    } catch (e) {
      /* eslint-disable-next-line no-console */
      console.error(`error parsing message from  "/stream": ${e}`);
    }
  };

  const onOpen = () => {
    onChange(true);
  };

  const onClose = () => {
    onChange(false);
  };

  const init = (event) => {
    if (event) {
      /* eslint-disable-next-line no-console */
      console.log('eventSource disconnected, reconnecting…');
      onClose();
      eventSource.close();
      eventSource.removeEventListener('open', onOpen);
      eventSource.removeEventListener('message', handleData);
      eventSource.removeEventListener('error', init);
    }

    window.setTimeout(() => {
      eventSource = new EventSource(new URL('/stream', apiBaseUrl));
      eventSource.addEventListener('error', init);
      eventSource.addEventListener('message', handleData);
      eventSource.addEventListener('open', onOpen);
    }, (event ? 50 : 0));
  };

  init();
}

export function getSavedPage() {
  const savedPage = Number.parseInt(window.localStorage.getItem('page'), 10);
  window.xState.set(
    '_selectedRoom',
    Number.isNaN(savedPage) ? 0 : savedPage
  );

  window.xState.subscribe(
    '_selectedRoom',
    (index) => {
      window.localStorage.setItem('page', index.toString(10));
    }
  );
}

export function getDarkMode() {
  const dark = window.localStorage.getItem('dark') !== null;
  window.xState.set('_darkMode', dark);

  window.xState.subscribe(
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
  const { hierarchy, strings = {} } = await fetchList() || {};

  window.xHierarchy = hierarchy;
  window.xExpand = expandTemplate(strings);
}

export async function setUpValues() {
  const values = async () => {
    const apiResponse = await fetchValues() || [];

    apiResponse.forEach(({ name = null, value = null }) => {
      if (!name || value === null) return;

      window.xState.set(name, value);
    });
  };

  let first = true;

  return new Promise((resolve) => {
    const { stream } = window.xFlags;

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
      window.xState.set(name, value);
    }, async (connected) => {
      if (first || connected) {
        await values();
        first = false;
      }
      window.xState.set('_stream', connected);
      resolve();
    });
  });
}

export async function setElement(...sets) {
  const url = new URL('/set', apiBaseUrl);

  sets.forEach(({ name, value }) => {
    url.searchParams.append(name, value);
  });

  if (
    ![...url.searchParams.keys()].length
  ) return Promise.resolve();

  return fetch(url, { credentials: 'include', redirect: 'follow' }).catch((reason) => {
    /* eslint-disable-next-line no-console */
    console.error(`error fetching "/set": ${reason}`);
  });
}
