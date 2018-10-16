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
    const { name, controls } = this.props;
    this.dataset.categoryName = name || '[none]';

    const itemNodes = controls.map((control) => {
      return c(
        'control',
        control
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
