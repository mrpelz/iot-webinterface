/* eslint-disable import/extensions */
import {
  BaseComponent,
  bem,
  c,
  h,
  render
} from '../../dom.js';

export class Category extends BaseComponent {
  create() {
    const { category: { category, groups } } = this.props;
    const displayName = window.xExpand(category) || '[none]';

    this.dataset.categoryName = displayName;

    const itemNodes = groups.map((group) => {
      const { type } = group;

      let node = 'switch';

      switch (type) {
        case 'environmental-sensor':
          node = 'metric';
          break;
        case 'binary-light':
          node = 'binary-light';
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
