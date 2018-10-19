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
    const {
      categories: {
        [category]: displayName = '[none]'
      }
    } = window.componentStrings;

    this.dataset.categoryName = displayName;

    const itemNodes = groups.map((group) => {
      return c(
        'control',
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
