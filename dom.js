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

    console.log(this.props);
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

    const childrenDrop = shadowRoot.querySelector('x-children');

    if (childrenDrop) {
      const target = document.createDocumentFragment();

      while (this.firstChild) {
        target.appendChild(this.firstChild);
      }

      const parent = childrenDrop.parentElement || shadowRoot;
      parent.replaceChild(target, childrenDrop);
    }
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
      constructor(deferRender = false, props = {}) {
        super(template);

        this.props = props;

        if (deferRender) return;
        this.render();
      }
    }
  );

  return slug;
}

export function getComponent(slug, props = {}) {
  const constructor = customElements.get(`x-${slug}`);
  if (!constructor) return null;

  return new constructor(true, props);
}
