const apiBaseUrl = `${window.location.protocol}//hermes.net.wurstsalat.cloud/`;

function fetchList() {
  const url = new URL('/list', apiBaseUrl);

  return fetch(url).then((response) => {
    return response.json();
  }).catch((reason) => {
    /* eslint-disable-next-line no-console */
    console.error(`error fetching "/list": ${reason}`);
    return null;
  });
}

function fetchValues() {
  const url = new URL('/values', apiBaseUrl);

  return fetch(url).then((response) => {
    return response.json();
  }).catch((reason) => {
    /* eslint-disable-next-line no-console */
    console.error(`error fetching "/values": ${reason}`);
    return null;
  });
}

function startStream(callback) {
  let eventSource = null;

  const handleData = ({ data }) => {
    if (!callback) return;

    try {
      const payload = JSON.parse(data);
      callback(payload);
    } catch (e) {
      /* eslint-disable-next-line no-console */
      console.error(`error parsing message from  "/stream": ${e}`);
    }
  };

  const init = () => {
    if (eventSource) {
      /* eslint-disable-next-line no-console */
      console.log('eventSource disconnected, reconnecting…');
      eventSource.close();
      eventSource.removeEventListener('message', handleData);
      eventSource.removeEventListener('error', init);
    }

    eventSource = new EventSource(new URL('/stream', apiBaseUrl));
    eventSource.addEventListener('error', init);
    eventSource.addEventListener('message', handleData);
  };

  init();
}

export async function setUpElements() {
  const { hierarchy, strings } = await fetchList() || {};

  window.componentHierarchy = hierarchy;
  window.componentStrings = strings;
}

export async function setUpValues() {
  const apiResponse = await fetchValues() || [];

  apiResponse.forEach(({ name = null, value = null }) => {
    if (!name || value === null) return;

    window.componentState.set(name, value);
  });

  startStream((data) => {
    const { isSystem = false, name, value } = data;

    if (isSystem) {
      /* eslint-disable-next-line no-console */
      console.log(data);
    }

    if (!name) return;
    window.componentState.set(name, value);
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

  return fetch(url).catch((reason) => {
    /* eslint-disable-next-line no-console */
    console.error(`error fetching "/set": ${reason}`);
  });
}
