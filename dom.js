const tagPrefix = 'x-';
const componentsDir = './components';
const templateFileName = 'template.html';
const styleFileName = 'style.css';
const cssClassAttribute = 'className';

function createChildSlot() {
  const result = new DocumentFragment();

  const slot = document.createElement('slot');
  result.appendChild(slot);

  return result;
}

function createDefaultStyle() {
  const style = document.createElement('style');
  style.innerHTML = '\n:host{display:block}\n';

  return style;
}

async function fetchTemplate(slug) {
  const templateUrl = new URL([componentsDir, slug, templateFileName].join('/'), window.location.origin);
  const templateString = await fetch(templateUrl).then((response) => {
    if (!response.ok) return null;
    return response.text();
  }).catch(() => {
    return null;
  });
  if (templateString === null) return null;

  const templateContainer = document.createRange();
  templateContainer.selectNode(document.body);

  return templateContainer.createContextualFragment(templateString);
}

async function fetchStyle(slug) {
  const styleUrl = new URL([componentsDir, slug, styleFileName].join('/'), window.location.origin);
  const styleString = await fetch(styleUrl).then((response) => {
    if (!response.ok) return null;
    return response.text();
  }).catch(() => {
    return null;
  });
  if (!styleString) return null;

  const style = document.createElement('style');
  style.innerHTML = `\n${styleString}\n`;

  return style;
}

async function fetchComponent({
  slug,
  component,
  template: hasTemplate = false,
  style: hasStyle = false
}) {
  const fetchingTemplate = hasTemplate
    ? fetchTemplate(slug)
    : Promise.resolve(createChildSlot());
  const fetchingStyle = hasStyle
    ? fetchStyle(slug)
    : Promise.resolve(createDefaultStyle());

  const [template, style] = await Promise.all([fetchingTemplate, fetchingStyle]);

  if (template === null || style === null) {
    const error = `cannot fetch data for component "${slug}"`;
    /* eslint-disable-next-line no-alert */
    alert(error);
    throw new Error(error);
  }

  if (template.firstChild) {
    template.insertBefore(style, template.firstChild);
  } else {
    template.appendChild(style);
  }

  return () => {
    customElements.define(
      `${tagPrefix}${slug}`,
      class extends component {
        constructor(props = {}) {
          super(template);
          this.props = props;
        }
      }
    );
  };
}

export function defineComponents(components = []) {
  return Promise.all(components.map((component) => {
    return fetchComponent(component);
  })).then((mounters) => {
    mounters.filter(Boolean).forEach((mounter) => {
      mounter();
    });
  });
}

export function bem(block, element, modifier) {
  let result = block || '';
  result += element ? `--${element}` : '';
  result += modifier ? `-${modifier}` : '';
  return result;
}

export function h(tag, attributes = {}, ...children) {
  if (!tag) throw new Error('no element given');

  return {
    tag,
    attributes,
    children: [].concat(...children)
  };
}

export function c(component, props = {}, ...children) {
  if (!component) throw new Error('no component given');

  return {
    component,
    props,
    children: [].concat(...children)
  };
}

export function render(...vnodes) {
  const result = document.createDocumentFragment();

  vnodes.forEach((vnode) => {
    if (vnode.split) {
      const text = document.createTextNode(vnode);
      result.appendChild(text);
      return;
    }

    const {
      attributes = {},
      children = [],
      component,
      props = {},
      tag
    } = vnode;

    let node;
    const Component = customElements.get(`${tagPrefix}${component}`);
    if (Component) {
      node = new Component(props);
    } else {
      node = document.createElement(tag || component);
    }

    Object.keys(attributes).forEach((attribute) => {
      const { [attribute]: value } = attributes;

      if (
        attribute === cssClassAttribute
        && Array.isArray(value)
      ) {
        value.filter(Boolean).forEach((className) => {
          node.classList.add(className);
        });
      } else if (attribute === 'dataset') {
        Object.assign(node.dataset, value);
      } else {
        node.setAttribute(attribute, value);
      }
    });

    children.forEach((child) => {
      node.appendChild(render(child));
    });

    result.appendChild(node);
  });

  return result;
}

function isFilledTextNode(child) {
  return Boolean(child.nodeType === 3 && child.textContent.trim());
}

export class BaseComponent extends HTMLElement {
  constructor(template) {
    super();
    this.template = template;
    this.firstRender = false;
  }

  propsChangedCallback() {
    if (!this.firstRender) return;

    if (this.render) {
      this.render();
    }

    this.slotChildNodes();
  }

  connectedCallback() {
    this.attachTemplate();

    if (this.create) {
      this.create();
    }

    this.firstRender = true;
    this.propsChangedCallback();
  }

  disconnectedCallback() {
    if (this.destroy) {
      this.destroy();
    }
  }

  delete() {
    this.parentNode.removeChild(this);
  }

  replace(newChild) {
    this.parentNode.replaceChild(newChild, this);
  }

  get(selector) {
    return (
      (this.shadowRoot && this.shadowRoot.querySelector(selector))
      || this.querySelector(selector)
    );
  }

  setProps(props = {}) {
    Object.assign(
      this.props,
      props
    );

    this.propsChangedCallback();
  }

  empty() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
  }

  attachTemplate() {
    this.attachShadow({ mode: 'open' });

    if (this.template) {
      this.shadowRoot.appendChild(
        this.template.cloneNode(true)
      );
    }
  }

  slotChildNodes() {
    this.normalize();

    this.childNodes.forEach((child) => {
      if (isFilledTextNode(child)) {
        const span = document.createElement('span');
        span.textContent = child.textContent;
        span.dataset.textNode = true;
        span.slot = '';
        this.replaceChild(span, child);
      } else if (!child.slot) {
        child.slot = '';
      }
    });
  }
}
