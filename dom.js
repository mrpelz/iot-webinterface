export class BaseComponent extends HTMLElement {
  static getTemplate(template) {
    return template.cloneNode(true);
  }

  attachTemplate(template) {
    const templateContents = BaseComponent.getTemplate(template);

    if (this.firstChild) {
      this.insertBefore(templateContents, this.firstChild);
    } else {
      this.appendChild(templateContents);
    }
  }

  shadowTemplate(template) {
    this.attachShadow({ mode: 'open' }).appendChild(
      BaseComponent.getTemplate(template)
    );
  }
}

export class ShadowTemplatedComponent extends BaseComponent {
  constructor(template) {
    super();
    this.shadowTemplate(template);
    this.moveChildNodes();
  }

  moveChildNodes() {
    const {
      shadowRoot
    } = this;

    const children = shadowRoot.querySelector('x-children');
    const target = document.createDocumentFragment();
    const targetElement = (children && children.parentElement) || shadowRoot;

    while (this.firstChild) {
      target.appendChild(this.firstChild);
    }

    if (children) {
      targetElement.insertBefore(target, children);
      children.parentElement.removeChild(children);
    } else {
      targetElement.appendChild(target);
    }
  }
}

export class TemplatedComponent extends BaseComponent {
  constructor(template) {
    super();
    this.attachTemplate(template);
  }
}

export async function defineComponent(slug, componentClass, hasStyle = false) {
  const templateUrl = new URL(`./components/${slug}/template.html`, window.location.origin);
  const templateString = await fetch(templateUrl).then((response) => {
    if (!response.ok) return null;
    return response.text();
  }).catch(() => {
    return null;
  });
  if (!templateString) return null;

  const templateContainer = document.createRange();
  templateContainer.selectNode(document.body);
  const template = templateContainer.createContextualFragment(templateString);

  if (hasStyle) {
    const styleUrl = new URL(`./components/${slug}/style.css`, window.location.origin);
    const styleString = await fetch(styleUrl).then((response) => {
      if (!response.ok) return null;
      return response.text();
    }).catch(() => {
      return null;
    });

    if (styleString) {
      const style = document.createElement('style');
      style.innerHTML = `\n${styleString}\n`;
      template.insertBefore(style, template.firstChild);
    }
  }

  customElements.define(
    `x-${slug}`,
    class extends componentClass {
      constructor() {
        super(template);
      }
    }
  );

  return slug;
}

export function getComponent(slug) {
  return document.createElement(`x-${slug}`);
}
