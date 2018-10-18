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

function getLocationNames(elements) {
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

function getGroupNames(elements) {
  const result = new Set();

  elements.forEach(({
    attributes: { group = null } = {}
  }) => {
    result.add(group);
  });

  return [...result].sort();
}

function elementsForLocation(elements, location) {
  return elements.filter(({
    attributes: { sortLocation = null, location: loc = null } = {}
  }) => {
    return (sortLocation || loc) === location;
  });
}

function elementsForCategory(elements, cat) {
  return elements.filter(({
    attributes: { category = null } = {}
  }) => {
    return category === cat;
  });
}

function elementsForGroup(elements, grp) {
  return elements.filter(({
    attributes: { group = null } = {}
  }) => {
    return group === grp;
  });
}

function getHierarchy(
  elements = [],
  { locations, categories, controls } = {}
) {
  const locationNames = getLocationNames(elements);

  const locationMap = sort(locationNames.map((locationName) => {
    const locationElements = elementsForLocation(elements, locationName);
    const categoryNames = getCategoryNames(locationElements);

    const categoryMap = sort(categoryNames.map((categoryName) => {
      const categoryElements = elementsForCategory(locationElements, categoryName);
      const groupNames = getGroupNames(categoryElements);

      const groupMap = sort([].concat(...groupNames.map((groupName) => {
        const groupElements = elementsForGroup(categoryElements, groupName);

        if (groupName === null) {
          return groupElements.map((controlElement) => {
            const {
              attributes: {
                control = null
              } = {}
            } = controlElement;

            return {
              name: control,
              single: true,
              elements: [controlElement]
            };
          });
        }

        return [{
          name: groupName,
          single: groupElements.length <= 1,
          elements: groupElements
        }];
      })), controls);

      return {
        name: categoryName,
        groups: groupMap
      };
    }), categories);

    return {
      name: locationName,
      categories: categoryMap
    };
  }), locations);

  return {
    locations: locationMap
  };
}

export async function setUpElements() {
  const apiResponse = await fetchList();

  const hierarchy = getHierarchy(
    apiResponse.elements,
    (apiResponse.meta || {}).sort
  );

  const strings = (apiResponse.meta || {}).strings || {};

  window.componentHierarchy = hierarchy;
  window.componentStrings = strings;
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
