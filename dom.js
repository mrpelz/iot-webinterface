const tagPrefix = 'x-';
const childrenReplacer = 'x-children';
const componentsDir = './components';
const templateFileName = 'template.html';
const styleFileName = 'style.css';

function deter() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        resolve();
      });
    });
  });
}

export class BaseComponent extends HTMLElement {
  static getTemplate(template) {
    return template.cloneNode(true);
  }

  constructor(template) {
    super();
    this.template = template;
  }

  render() {
    this.attachTemplate(this.template);
    this.moveChildNodes();
  }

  delete() {
    this.parentNode.removeChild(this);
  }

  replace(newChild) {
    this.parentNode.replaceChild(newChild, this);
  }

  attachTemplate(template) {
    this.attachShadow({ mode: 'open' }).appendChild(
      BaseComponent.getTemplate(template)
    );
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
  if (!templateString) return null;

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

export async function defineComponent(slug, componentClass, hasStyle = false) {
  const fetchingTemplate = fetchTemplate(slug);
  const fetchingStyle = hasStyle ? fetchStyle(slug) : Promise.resolve(null);

  const [template, style] = await Promise.all([fetchingTemplate, fetchingStyle]);

  if (!template) return;

  if (style) {
    template.insertBefore(style, template.firstChild);
  }

  const define = () => {
    customElements.define(
      `${tagPrefix}${slug}`,
      class extends componentClass {
        constructor(deferRender = false, props = {}) {
          super(template);

          this.props = props;

          if (deferRender) return;
          this.render();
        }
      }
    );
  };

  // work around firefox (and chrome?) render bug
  await deter();
  define();
}

export function getComponent(slug, props = {}) {
  const constructor = customElements.get(`${tagPrefix}${slug}`);
  if (!constructor) return null;

  return new constructor(true, props);
}
