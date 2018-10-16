const apiBaseUrl = `${window.location.protocol}//hermes.net.wurstsalat.cloud/`;

function fetchList() {
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

function sort(input = [], list = []) {
  const unsorted = input.filter(({ name }) => {
    return !list.includes(name);
  });

  const sorted = list.map((sortKey) => {
    return input.find(({ name }) => {
      return name === sortKey;
    });
  }).filter(Boolean);

  return [].concat(sorted, unsorted);
}

function getRoomNames(elements) {
  const result = new Set();

  elements.forEach(({
    attributes: { sortLocation = null, location = null } = {}
  }) => {
    result.add(sortLocation || location);
  });

  return [...result].sort();
}

function getCategoryNames(elements) {
  const result = new Set();

  elements.forEach(({
    attributes: { category = null } = {}
  }) => {
    result.add(category);
  });

  return [...result].sort();
}

function getControlNames(elements) {
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

function getHierarchy(
  elements = [],
  { rooms, categories, controls } = {}
) {
  const roomNames = getRoomNames(elements);

  const roomMap = sort(roomNames.map((roomName) => {
    const roomElements = elementsForRoom(elements, roomName);
    const categoryNames = getCategoryNames(roomElements);

    const categoryMap = sort(categoryNames.map((categoryName) => {
      const categoryElements = elementsForCategory(roomElements, categoryName);
      const controlNames = getControlNames(categoryElements);

      const controlMap = sort([].concat(...controlNames.map((controlName) => {
        const controlElements = elementsForControl(categoryElements, controlName);

        if (controlName === null) {
          return controlElements.map((controlElement) => {
            const {
              attributes: {
                displayName = null
              } = {}
            } = controlElement;

            return {
              name: displayName,
              elements: [controlElement]
            };
          });
        }

        return [{
          name: controlName,
          elements: controlElements
        }];
      })), controls);

      return {
        name: categoryName,
        controls: controlMap
      };
    }), categories);

    return {
      name: roomName,
      categories: categoryMap
    };
  }), rooms);

  return {
    rooms: roomMap
  };
}

function getElements(elements = []) {
  return elements.map((element) => {
    const result = Object.assign({}, element);
    delete result.value;

    return result;
  });
}

function getValues(elements = []) {
  return elements.map(({ name, value }) => {
    return {
      name,
      value
    };
  });
}

export async function setUpApi() {
  const apiResponse = await fetchList();

  const hierarchy = getHierarchy(
    getElements(apiResponse.elements),
    (apiResponse.meta || {}).sort
  );
  const values = getValues(apiResponse.elements);

  window.componentState.set('_hierarchy', hierarchy);

  values.forEach(({ name, value }) => {
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
