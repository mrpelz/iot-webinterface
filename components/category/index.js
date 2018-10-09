/* eslint-disable import/extensions */
import {
  BaseComponent,
  h,
  render
} from '../../dom.js';

export class Category extends BaseComponent {
  create() {
    const { name, controls } = this.props;

    this.dataset.categoryName = name || '[none]';

    const content = JSON.stringify(controls, null, 2);

    this.appendChild(
      render(
        h(
          'pre',
          {},
          content
        )
      )
    );
  }
}
