/* eslint-disable import/extensions */
import {
  BaseComponent,
  c,
  render
} from '../../dom.js';

export class Menu extends BaseComponent {
  create() {
    const { rooms = [] } = window.componentState.get('_hierarchy');
    const elementNodes = rooms.map((_, id) => {
      return c(
        'menu-element',
        { id }
      );
    });

    this.appendChild(
      render(...elementNodes)
    );
  }

  render() {
    window.setTimeout(() => {
      this.scrollLeft = 0;
    }, 0);
  }
}
