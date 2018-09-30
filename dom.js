const tagPrefix = 'x-';
const childrenReplacer = 'x-children';
const componentsDir = './components';
const templateFileName = 'template.html';
const styleFileName = 'style.css';

export class BaseComponent extends HTMLElement {
  constructor(template) {
    super();
    this.template = template;
  }

  connectedCallback() {
    console.log(`${this.tagName} attach start`, this);
    this.attachTemplate();
    this.moveChildNodes();

    if (this.render) {
      this.render();
    }
    console.log(`${this.tagName} attach end`, this);
  }

  delete() {
    this.parentNode.removeChild(this);
  }

  replace(newChild) {
    this.parentNode.replaceChild(newChild, this);
  }

  get(selector) {
    return this.shadowRoot.querySelector(selector);
  }

  attachTemplate() {
    this.attachShadow({ mode: 'open' });

    if (this.template) {
      this.shadowRoot.appendChild(
        this.template.cloneNode(true)
      );
    }
  }

  moveChildNodes() {
    const {
      shadowRoot
    } = this;

    const childrenDrop = shadowRoot.querySelector(childrenReplacer);

    if (childrenDrop) {
      const target = document.createDocumentFragment();

      const children = this.querySelectorAll(':scope > *:not([slot])');

      children.forEach((child) => {
        target.appendChild(child);
      });

      childrenDrop.parentNode.replaceChild(target, childrenDrop);
    }
  }
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
    : Promise.resolve(new DocumentFragment());
  const fetchingStyle = hasStyle ? fetchStyle(slug) : Promise.resolve(undefined);

  const [template, style] = await Promise.all([fetchingTemplate, fetchingStyle]);

  if (template === null || style === null) {
    const error = `cannot fetch data for component "${slug}"`;
    alert(error);
    throw new Error(error);
  }

  if (style) {
    if (template.firstChild) {
      template.insertBefore(style, template.firstChild);
    } else {
      template.appendChild(style);
    }
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
    window.requestAnimationFrame(() => {
      mounters.filter(Boolean).forEach((mounter) => {
        mounter();
      });
    });
  });
}

export async function getComponent(slug) {
  const elementName = `${tagPrefix}${slug}`;
  await customElements.whenDefined(elementName);

  const constructor = customElements.get(elementName);
  if (!constructor) return null;

  return constructor;
}
