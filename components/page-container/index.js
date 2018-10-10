/* eslint-disable import/extensions */
import {
  BaseComponent,
  c,
  render
} from '../../dom.js';

export class PageContainer extends BaseComponent {
  create() {
    const { rooms = [] } = window.componentState.get('_hierarchy');
    const elementNodes = rooms.map(({ categories }, id) => {
      return c(
        'page',
        {
          id,
          categories
        }
      );
    });

    this.appendChild(
      render(...elementNodes)
    );
  }
}
