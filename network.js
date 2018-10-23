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

function sort(input = [], list = [], key = 'name') {
  const unsorted = input.filter(({ [key]: name }) => {
    return !list.includes(name);
  });

  const sorted = list.map((sortKey) => {
    return input.find(({ [key]: name }) => {
      return name === sortKey;
    });
  }).filter(Boolean);

  return [].concat(sorted, unsorted);
}

function getNames(elements, key = 'name') {
  const result = new Set();

  elements.forEach(({
    attributes: { [key]: value = null } = {}
  }) => {
    result.add(value);
  });

  return [...result].sort();
}

function elementsInHierarchy(elements, value, key = 'name') {
  return elements.filter(({
    attributes: { [key]: is = null } = {}
  }) => {
    return is === value;
  });
}

function combineAttributes(elements) {
  return Object.assign(
    {},
    ...elements.map((element) => {
      const { attributes = {} } = element;
      return attributes;
    })
  );
}

function showSubLabel(elements) {
  const controls = new Set();
  const doubled = new Set();

  elements.forEach((element) => {
    const {
      attributes: {
        label = null
      } = {}
    } = element;

    if (!label) return;

    if (controls.has(label)) {
      doubled.add(label);
    }

    controls.add(label);
  });

  return elements.map((element) => {
    const {
      attributes,
      attributes: {
        label
      } = {}
    } = element;

    if (doubled.has(label)) {
      attributes.showSubLabel = true;
    }

    return element;
  });
}

function getHierarchy(
  elements = [],
  { sections, categories, labels } = {}
) {
  const sectionNames = getNames(elements, 'section');
  const sectionMap = sort(sectionNames.map((sectionName) => {
    const sectionElements = elementsInHierarchy(elements, sectionName, 'section');

    const categoryNames = getNames(sectionElements, 'category');
    const categoryMap = sort(categoryNames.map((categoryName) => {
      const categoryElements = showSubLabel(
        elementsInHierarchy(sectionElements, categoryName, 'category')
      );

      const groupNames = getNames(categoryElements, 'group');
      const groupMap = sort([].concat(...groupNames.map((groupName) => {
        const groupElements = elementsInHierarchy(categoryElements, groupName, 'group');

        if (groupName === null) {
          return groupElements.map((groupElement) => {
            const {
              attributes,
              attributes: {
                label = null
              }
            } = groupElement;

            return {
              group: label,
              single: true,
              attributes,
              elements: [groupElement]
            };
          });
        }

        return [{
          group: groupName,
          single: groupElements.length <= 1,
          attributes: combineAttributes(groupElements),
          elements: groupElements
        }];
      })), labels, 'group');

      return {
        category: categoryName,
        groups: groupMap
      };
    }), categories, 'category');

    return {
      section: sectionName,
      categories: categoryMap
    };
  }), sections, 'section');

  return {
    sections: sectionMap
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
