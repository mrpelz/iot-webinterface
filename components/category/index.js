import {
  BaseComponent,
  bem,
  c,
  h,
  render
} from '../../dom.js';

function getGroupExtension(group = {}) {
  const { elements = [] } = group;
  if (elements.length > 1) return false;

  const [element = {}] = elements;
  const { name, attributes: { isExtension } = {} } = element;
  if (!isExtension) return false;

  return name;
}

export class Category extends BaseComponent {
  create() {
    const { category: { category, groups } } = this.props;
    const displayName = window.xExpand(category);

    if (category) {
      this.dataset.categoryName = displayName;
    }

    const itemNodes = groups.map((group) => {
      const extension = getGroupExtension(group);
      if (extension) {
        return c(extension, { group });
      }

      const { type } = group;

      let node = 'switch';

      switch (type) {
        case 'environmental-sensor':
          node = 'metric';
          break;
        case 'binary-light':
          node = 'binary-light';
          break;
        case 'connection':
          node = 'connection';
          break;
        case 'door-sensor':
          node = 'door';
          break;
        case 'fan':
          node = 'fan';
          break;
        case 'security':
          node = 'security';
          break;
        case 'pir':
          node = 'pir';
          break;
        case 'ahu':
        case 'led':
          node = 'up-down';
          break;
        default:
      }

      return c(
        node,
        { group }
      );
    });

    this.appendChild(
      render(
        h(
          'section',
          { className: [bem('category', 'content')] },
          itemNodes
        )
      )
    );
  }
}
