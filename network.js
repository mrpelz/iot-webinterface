const apiBaseUrl = `${window.location.protocol}//hermes.net.wurstsalat.cloud/`;

function fetchList() {
  const url = new URL('/list', apiBaseUrl);

  return fetch(url).then((response) => {
    return response.json();
  }).catch((reason) => {
    /* eslint-disable-next-line no-console */
    console.error(`error fetching "/list": ${reason}`);
  });
}

function fetchValues() {
  const url = new URL('/values', apiBaseUrl);

  return fetch(url).then((response) => {
    return response.json();
  }).catch((reason) => {
    /* eslint-disable-next-line no-console */
    console.error(`error fetching "/values": ${reason}`);
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
              single: true,
              elements: [controlElement]
            };
          });
        }

        return [{
          name: controlName,
          single: controlElements.length <= 1,
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

export async function setUpElements() {
  const apiResponse = await fetchList();

  const hierarchy = getHierarchy(
    apiResponse.elements,
    (apiResponse.meta || {}).sort
  );

  window.componentHierarchy = hierarchy;
}

export async function setUpValues() {
  const apiResponse = await fetchValues();

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
