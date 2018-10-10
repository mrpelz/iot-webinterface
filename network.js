const apiBaseUrl = `${window.location.protocol}//hermes.net.wurstsalat.cloud/`;

function fetchElements() {
  const url = new URL('/list', apiBaseUrl);
  url.searchParams.append('values', true);

  return fetch(url).then((response) => {
    return response.json();
  }).catch((reason) => {
    /* eslint-disable-next-line no-console */
    console.error(`error fetching "/list": ${reason}`);
  });
}

function startStream(callback) {
  const eventSource = new EventSource(new URL('/stream', apiBaseUrl));
  eventSource.addEventListener('message', ({ data }) => {
    if (!callback) return;

    try {
      const payload = JSON.parse(data);
      callback(payload);
    } catch (e) {
      /* eslint-disable-next-line no-console */
      console.error(`error parsing message from  "/stream": ${e}`);
    }
  });
}

function roomNames(elements) {
  const result = new Set();

  elements.forEach(({
    attributes: { sortLocation = null, location = null } = {}
  }) => {
    result.add(sortLocation || location);
  });

  return [...result].sort();
}

function categoryNames(elements) {
  const result = new Set();

  elements.forEach(({
    attributes: { category = null } = {}
  }) => {
    result.add(category);
  });

  return [...result].sort();
}

function controlNames(elements) {
  const result = new Set();

  elements.forEach(({
    attributes: { control = null } = {}
  }) => {
    result.add(control);
  });

  return [...result].sort();
}

function elementsForRoom(elements, room) {
  return elements.filter(({
    attributes: { sortLocation = null, location = null } = {}
  }) => {
    return (sortLocation || location) === room;
  });
}

function elementsForCategory(elements, cat) {
  return elements.filter(({
    attributes: { category = null } = {}
  }) => {
    return category === cat;
  });
}

function elementsForControl(elements, con) {
  return elements.filter(({
    attributes: { control = null } = {}
  }) => {
    return control === con;
  });
}

function getHierarchy(elements = []) {
  const rooms = roomNames(elements);

  const roomMap = rooms.map((roomName) => {
    const roomElements = elementsForRoom(elements, roomName);
    const categories = categoryNames(roomElements);

    const categoryMap = categories.map((categoryName) => {
      const categoryElements = elementsForCategory(roomElements, categoryName);
      const controls = controlNames(categoryElements);

      const controlMap = [].concat(...controls.map((controlName) => {
        const controlElements = elementsForControl(categoryElements, controlName);

        if (controlName === null) {
          return controlElements.map((controlElement) => {
            return {
              name: controlName,
              elements: [controlElement]
            };
          });
        }

        return [{
          name: controlName,
          elements: controlElements
        }];
      }));

      return {
        name: categoryName,
        controls: controlMap
      };
    });

    return {
      name: roomName,
      categories: categoryMap
    };
  });

  return {
    rooms: roomMap
  };
}

function getElements(elements) {
  return elements.map((element) => {
    const result = Object.assign({}, element);
    delete result.value;

    return result;
  });
}

function getValues(elements) {
  return elements.map(({ name, value }) => {
    return {
      name,
      value
    };
  });
}

export async function setUpApi() {
  const apiResponse = await fetchElements();

  const hierarchy = getHierarchy(getElements(apiResponse));
  const values = getValues(apiResponse);

  window.componentState.set('_hierarchy', hierarchy);
  window.componentState.set('_selectedRoom', 0);

  values.forEach(({ name, value }) => {
    window.componentState.set(name, value);
  });

  startStream(({ name, value }) => {
    if (!name) return;
    window.componentState.set(name, value);
  });
}

export async function setElement(...sets) {
  const url = new URL('/set', apiBaseUrl);

  sets.forEach(({ name, value }) => {
    if (window.componentState.get(name) === value) return;
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
